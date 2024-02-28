const jwt = require("jsonwebtoken");
const fs = require("fs");
const crypto = require("crypto");
/**
 * Verifies a JSON Web Token (JWT) using the provided public keys.
 *
 * @param {string} requestToken - The JWT to be verified.
 * @param {string[]} publicKeys - An array of public keys used for verification.
 * @returns {Promise<object>} - The decoded payload of the JWT.
 */
const verifyJWT = async (requestToken, publicKeys) => {
  let decoded;
  try {
    //loop through public keys
    for (let i = 0; i < publicKeys.length; i++) {
      // decode public key from base64
      const publicKey = crypto.createPublicKey({
        key: Buffer.from(publicKeys[i], 'base64').toString('utf-8'),
        format: 'pem',
      });
      // verify token
      decoded = jwt.verify(requestToken, publicKey, {
        algorithms: ["ES256"],
      });
    }
  } catch (err) {
  }
  return decoded;
};

/**
 * Signs a JSON Web Token (JWT) using the provided private key.
 *
 * @param {object} request - The payload to be signed.
 * @returns {string} - The signed JWT.
 */
const signJWT = (request) => {
  privateKey = fs.readFileSync(`${process.env.PRIVATE_KEY_PATH}`);
  return jwt.sign(request, privateKey, { algorithm: "ES256" });
};

/**
 * Decodes a JSON Web Token (JWT).
 *
 * @param {string} token - The JWT to be decoded.
 * @returns {object} - The decoded payload of the JWT.
 */
const decodeJWT = (token) => {
  return jwt.decode(token);
};

module.exports = {
  verifyJWT,
  signJWT,
  decodeJWT,
};
