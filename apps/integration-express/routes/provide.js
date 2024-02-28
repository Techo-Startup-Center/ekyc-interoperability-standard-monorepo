var express = require('express');
var router = express.Router();
const User = require('../models/user');
const { generateUser, enrollUser } = require('../utils/user');
const { wrapOAeKYC } = require('../utils/oa');
const { verifyJwt, generateJwt, verifyFetchSignature } = require('../utils/jwt');
const { v4: uuidv4 } = require('uuid');
const ErrorCode = require('../errors/error_code');
const crypto = require('crypto');
const moment = require('moment');
const Session = require('../models/session');
const axios = require('axios');

/* GET home page. */
router.post("/signup", async (req, res, next) => {
  const { pub_key, user } = req.body;
  const current_user = await User.findOne({ pub_key: pub_key });
  if (current_user) {
    console.log(`pub_key already exists: ${pub_key}`);
    next(new ErrorCode("pub_key already exists", 400))
    return;
  }
  const newUser = new User({ ...user, pub_key: pub_key, id: uuidv4() });
  // enroll user
  try {
    const respond = await enrollUser(newUser);
    res.status(200).json(respond);
  } catch (err) {
    console.log(err);
    next(err)
    return;
  }
});
router.post("/register", async (req, res, next) => {
  const { pub_key } = req.body;
  // check if pub_key already exists
  const user = await User.findOne({ pub_key: pub_key });
  if (user) {
    console.log(`pub_key already exists: ${pub_key}`);
    next(new ErrorCode("pub_key already exists", 400))
    return;
  }
  // create new user
  const newUser = await generateUser();
  newUser.pub_key = pub_key;
  newUser.id = uuidv4();

  // enroll user
  try {
    const respond = await enrollUser(newUser);
    res.status(200).json(respond);
  } catch (err) {
    console.log(err);
    next(err)
    return;
  }
});
router.post("/verify", async (req, res, next) => {
  const { qr } = req.body;
  // verify the qr jwt
  var respond;
  try {
    respond = await verifyJwt(qr)
  } catch (err) {
    console.log(err)
    next(err)
    return
  }
  respond.qr = qr;
  res.status(200).json(respond);
});
router.post("/authenticate", async (req, res, next) => {
  const { qr, uid, signature } = req.body;
  // check if uid exists
  const user = await User.findOne({ id: uid });
  if (!user) {
    console.log(`user not found: ${uid}`);
    next(new ErrorCode("user not found", 400))
    return;
  }
  // verify qr jwt
  var respond = null
  try {
    respond = await verifyJwt(qr);
  } catch (err) {
    console.log(err);
    next(err)
    return;
  }
  // verify signature
  const verify = crypto.createVerify('SHA256');
  verify.update(qr);
  const publicKey = crypto.createPublicKey({
    key: Buffer.from(user.pub_key, 'base64').toString('utf-8'),
    format: 'pem',
  });
  const isVerified = verify.verify(publicKey, signature, 'base64');
  if (!isVerified) {
    console.log(`Invalid signature: ${signature}`);
    next(new ErrorCode("Invalid signature", 400))
    return;
  }
  // generate auth token
  const authPayload = {
    type: "ekyc_interop_auth_v1",
    template: respond.payload.template,
    jti: respond.payload.jti,
    iss: process.env.ISS,
    callback: process.env.PROVIDER_CALLBACK_URL,
    exchange_mode: process.env.EXCHANGE_MODE,
    iat: moment().unix(),
    exp: moment().add(parseInt(process.env.EXP_MINUTE), "minutes").unix(),
  }
  var auth_token = null;
  try {
    auth_token = await generateJwt(authPayload);
  } catch (err) {
    console.log(err);
    next(err)
    return;
  }
  // initiate new request session
  const session = new Session({
    jti: respond.payload.jti,
    type: "PROVIDE",
    qr_type: respond.payload.qr_type,
    template: respond.payload.template,
    requester_exchange_mode: respond.payload.exchange_mode,
    requester_callback: respond.payload.callback,
    requester_iss: respond.payload.iss,
    requester_iat: respond.payload.iat,
    requester_exp: respond.payload.exp,
    request_token: qr,
    status: "AUTHENTICATED",
    callback_status: "PENDING",
    provider_callback: authPayload.callback,
    provider_iss: authPayload.iss,
    provider_exchange_mode: authPayload.exchange_mode,
    provider_iat: authPayload.iat,
    provider_exp: authPayload.exp,
    auth_token: auth_token,
    uid: uid,
  });
  try {
    await session.save();
  } catch (err) {
    console.log(err);
    next(new ErrorCode("Error saving session", 500))
    return;
  }
  // push auth token to callback url
  const callback_url = respond.payload.callback;
  try {
    const response = await axios.post(callback_url, { auth_token: auth_token }, {
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      session.callback_status = "SUCCESS";
      await session.save();
    } else {
      session.callback_status = "FAILED";
      await session.save();
      console.error(`Error pushing auth token: ${response.data.message}`)
      throw new ErrorCode("Error pushing auth token", 500);
    }
  } catch (err) {
    console.log(err);
    next(new ErrorCode("Internal Server Error", 500))
    return;
  }
  res.status(200).json({ status: "success" });
});
router.post("/callback", async (req, res, next) => {
  const { auth_token, sig } = req.body;
  // verify auth token
  var respond = null
  try {
    respond = await verifyJwt(auth_token);
  } catch (err) {
    console.log(err);
    next(err)
    return;
  }
  // get jti from the data
  const sessionId = respond.payload.jti;
  // get session from mongo db
  var session = null
  try {
    session = await Session.findOne({ jti: sessionId });
    if (!session) {
      next(new ErrorCode("Invalid jti", 400))
      return;
    }
  } catch (e) {
    next(e)
    return
  }
  // // return error if session status is not AUTHENTICATED
  // if (session.status !== "AUTHENTICATED") {
  //   next(new ErrorCode("Invalid Session", 400))
  //   return;
  // }
  // verify signature
  const data = await verifyFetchSignature(auth_token, sig, session.requester_iss);
  // update session status to CALLBACK
  session.status = "SUCCESS";
  session.callback_status = "SUCCESS";
  await session.save();
  // get user info
  const user = await User.findOne({ id: session.uid });
  if (!user) {
    next(new ErrorCode("Invalid user", 400))
    return;
  }
  res.status(200).json({ oa: JSON.parse(user.oa_doc) });
});
module.exports = router;
