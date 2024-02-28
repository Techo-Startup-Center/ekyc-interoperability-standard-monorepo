const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user_pub: String,
  jti: String,
  type: String,
  qr_type: String,
  template: String,
  requester_exchange_mode: String,
  requester_callback: String,
  requester_iss: String,
  requester_iat: Number,
  requester_exp: Number,
  request_token: String,
  callback_status: String,
  status: String,
  provider_callback: String,
  provider_iss: String,
  provider_exchange_mode: String,
  provider_iat: Number,
  provider_exp: Number,
  auth_token: String,
  uid: String,
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;