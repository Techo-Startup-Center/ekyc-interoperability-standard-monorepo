var express = require("express");
var router = express.Router();
var moment = require("moment");
var mongoose = require("mongoose");
var mongoConnect = require("../config/mongo");
const { v4: uuidv4 } = require("uuid");
const Session = require("../models/session");
const User = require("../models/user");
const { verifyJwt, generateJwt, generateFetchSignature } = require("../utils/jwt");
const { verifyOAeKYC, } = require("../utils/oa");
const QRCode = require("qrcode");
const ErrorCode = require("../errors/error_code");
const axios = require("axios");

mongoose.connect(mongoConnect);

/* GET users listing. */
router.post("/new", async (req, res, next) => {
  const { pub_key } = req.body;
  const uuid = uuidv4().toString();
  const timeUnix = moment();
  qrSession = {
    qr_type: "ekyc_interop",
    template: process.env.REQUEST_TIER,
    jti: `${timeUnix.unix().toString()}-${uuid}`,
    exchange_mode: process.env.EXCHANGE_MODE,
    callback: process.env.REQUESTER_CALLBACK_URL,
    iss: process.env.ISS,
    iat: timeUnix.unix(),
    exp: timeUnix.add(parseInt(process.env.EXP_MINUTE, 10), "minute").unix(),
  };
  // Generate token by call post request to ekycis helper service
  var token = "";
  try {
    token = await generateJwt(qrSession);
  } catch (e) {
    next(e)
    return;
  }
  const qrCodeDataUrl = await QRCode.toDataURL(token);
  const base64Image = qrCodeDataUrl.split(',')[1];
  // proceed to save the session to mongo db
  const session = new Session({
    user_pub: pub_key,
    jti: qrSession.jti,
    qr_type: qrSession.qr_type,
    template: qrSession.template,
    requester_exchange_mode: qrSession.exchange_mode,
    requester_callback: qrSession.callback,
    requester_iss: qrSession.iss,
    requester_iat: qrSession.iat,
    requester_exp: qrSession.exp,
    requester_qr: token,
    status: "pending",
    type: "requester",
  });
  // save to mongo db
  try {
    saveSession = await session.save();
    if (!saveSession) {
      console.log("Error saving session to mongo db")
      next(new ErrorCode("Internal Server Error", 500))
      return;
    }
    res.status(200).json({ qr: token, qr_img: base64Image, jti: qrSession.jti });
  } catch (e) {
    next(new ErrorCode("Internal Server Error", 500))
  }
});

router.post("/callback", async (req, res, next) => {
  // verify auth_token in request body using axios with ekycis helper service
  const auth_token = req.body.auth_token;
  var data = null;
  try {
    data = await verifyJwt(auth_token);
  } catch (e) {
    next(e)
    return;
  }
  // get iss from the data
  const iss = data.payload.iss;
  // verify if the iss is in the allowlist
  const allowlist = process.env.PROVIDER_ALLOWLIST.split(",");
  if (!allowlist.includes(iss)) {
    console.log(`Invalid iss: ${iss}`);
    next(new ErrorCode("Invalid iss", 400))
    return;
  }
  // get jti from the data
  const sessionId = data.payload.jti;
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

  // check if exp is already expired
  const timeUnix = moment();
  if (timeUnix.unix() > session.exp) {
    console.log(`Session expired: ${sessionId}`);
    // set session status to expired
    session.status = "expired";
    try {
      await session.save();
      res.status(400).json({ message: "Session expired" });
    } catch (e) {
      next(new ErrorCode("Internal Server Error", 500))
    }
    return;
  }
  // check if session type is requester
  if (session.type !== "requester") {
    console.log(`Invalid session type: ${session.type}`);
    res.status(400).json({ message: "Invalid session type" });
    return;
  }
  // return error if session status is not pending
  if (session.status !== "pending") {
    console.log(`Session already processed: ${sessionId}`);
    res.status(400).json({ message: "Session already processed" });
    return;
  }
  // update session status to callback
  session.status = "callback";
  session.provider_callback = data.payload.callback;
  session.provider_iss = data.payload.iss;
  session.exchange_mode = data.payload.exchange_mode;
  session.provider_exp = data.payload.exp;
  session.auth_token = auth_token;
  await session.save();
  // return success
  res.status(200).json({ message: "Success" });
});

router.get("/status", async (req, res, next) => {
  // get jti from the request body
  const sessionId = req.query.jti;
  // get session from mongo db
  const session = await Session.findOne({ jti: sessionId });
  if (!session) {
    console.log(`Invalid jti: ${sessionId}`);
    next(new ErrorCode("Invalid jti", 400))
    return;
  }
  // check if session type is requester
  if (session.type !== "requester") {
    console.log(`Invalid session type: ${session.type}`);
    next(new ErrorCode("Invalid session type", 400))
    return;
  }
  // return error if session status is not pending
  if (session.status !== "pending" && session.status !== "callback") {
    next(new ErrorCode("Invalid Session", 400))
    return;
  }
  if (session.status === "pending") {
    res.status(200).json({ message: "Pending" });
    return;
  }
  // check if provider token is already expired
  const timeUnix = moment();
  if (timeUnix.unix() > session.provider_exp) {
    console.log(`Session expired: ${sessionId}`);
    // set session status to expired
    session.status = "expired";
    try {
      await session.save();
      next(new ErrorCode("Session expired", 400))
    } catch (e) {
      next(new ErrorCode("Internal Server Error", 500))
    }
    return;
  }
  // if reach here then session status is callback
  // check if auth token is valid
  const auth_token = session.auth_token;
  var data = null;
  try {
    data = verifyJwt(auth_token);
  } catch (e) {
    console.error(e);
    next(e)
    return;
  }
  // generate fetch signature from the auth_token
  var sig = null
  try {
    sig = await generateFetchSignature(auth_token);
  } catch (e) {
    console.error(e);
    next(e)
    return;
  }
  // perform post via axios to retrieve user OA
  var ekyc_oa = null;
  const providerFetchEndpoint = `${session.provider_callback}`;
  try {
    const response = await axios.post(providerFetchEndpoint, { auth_token: auth_token, sig: sig }, {
      headers: { "Content-Type": "application/json" },
    });
    if (response.status !== 200) {
      console.error(`Error fetching user info: ${response.data.message}`)
      throw new ErrorCode("Internal Server Error", 500);
    }
    ekyc_oa = response.data.oa;
  } catch (e) {
    console.error(e);
    next(e)
    return;
  }
  // verify oa respond from provider
  if (!ekyc_oa) {
    console.log(`Invalid OA: ${ekyc_oa}`);
    next(new ErrorCode("Invalid OA", 400))
    return;
  }
  // verify oa signature
  var oa_data = null;
  try {
    oa_data = await verifyOAeKYC(ekyc_oa);
  } catch (e) {
    console.error(e);
    next(e)
    return;
  }
  const user_info = oa_data.user_info;
  // proceed to save the user to mongo db
  const user = new User({
    id: uuidv4().toString(),
    phone_number: user_info.phone_number,
    first_name: user_info.first_name,
    last_name: user_info.last_name,
    document_type: user_info.document_type,
    document_id: user_info.document_id,
    email: user_info.email,
    dob: user_info.dob,
    gender: user_info.gender,
    issue_date: user_info.issue_date,
    expiry_date: user_info.expiry_date,
    face_image: oa_data.face_image,
    document_image: oa_data.document_image,
    pub_key: session.user_pub,
  })

  // save to mongo db
  try {
    const saveUser = await user.save();
    if (!saveUser) {
      console.log("Error saving user to mongo db")
      next(new ErrorCode("Internal Server Error", 500))
      return;
    }
    // return success
    res.status(200).json({ message: "Success", user: saveUser });
  } catch (e) {
    next(new ErrorCode("Internal Server Error", 500))
  }
});

module.exports = router;
