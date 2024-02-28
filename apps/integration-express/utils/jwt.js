const axios = require("axios");
const ErrorCode = require("../errors/error_code");

const verifyJwt = async (jwt) => {
    const ekycHelperVerifyEndpoint = process.env.EKYC_HELPER_URL + "/api/v1/jwt/verify";
    try {
        const response = await axios.post(ekycHelperVerifyEndpoint, { token: jwt }, {
            headers: { "Content-Type": "application/json" },
        });
        if (response.status !== 200) {
            console.log(`Error verifying jwt: ${response.data.message}`)
            throw new ErrorCode("Invalid token", 400);
        }
        return response.data;
    } catch (e) {
        console.error(e.message);
        throw new ErrorCode("Internal Server Error", 500);
    }
}

const generateJwt = async (data) => {
    const ekycHelperGenerateEndpoint = process.env.EKYC_HELPER_URL + "/api/v1/jwt/generate";
    try {
        const response = await axios.post(ekycHelperGenerateEndpoint, data, {
            headers: { "Content-Type": "application/json" },
        });
        if (response.status !== 200) {
            console.error(`Error generating jwt: ${response.data.message}`)
            throw new ErrorCode("Internal Server Error", 500);
        }
        return response.data.token;
    } catch (e) {
        console.error(e);
        throw new ErrorCode("Internal Server Error", 500);
    }
}

const generateFetchSignature = async (auth_token) => {
    const ekycHelperSignatureEndpoint = process.env.EKYC_HELPER_URL + "/api/v1/jwt/fetch-sign";
    try {
        const response = await axios.post(ekycHelperSignatureEndpoint, { "auth_token": auth_token }, {
            headers: { "Content-Type": "application/json" },
        });
        if (response.status !== 200) {
            console.error(`Error generating fetch signature: ${response.data.message}`)
            throw new ErrorCode("Internal Server Error", 500);
        }
        return response.data.signature;
    } catch (e) {
        console.error(e);
        throw new ErrorCode("Internal Server Error", 500);
    }
}
const verifyFetchSignature = async (auth_token, signature, requester_domain) => {
    const ekycHelperVerifySignatureEndpoint = process.env.EKYC_HELPER_URL + "/api/v1/jwt/fetch-verify";
    try {
        const response = await axios.post(ekycHelperVerifySignatureEndpoint, { "auth_token": auth_token, "signature": signature, "requester_domain": requester_domain }, {
            headers: { "Content-Type": "application/json" },
        });
        if (response.status !== 200) {
            console.error(`Error verifying fetch signature: ${response.data.message}`)
            throw new ErrorCode("Internal Server Error", 500);
        }
        return response.data;
    } catch (e) {
        console.error(e);
        throw new ErrorCode("Internal Server Error", 500);
    }
}

module.exports = {
    verifyJwt,
    generateJwt,
    generateFetchSignature,
    verifyFetchSignature
}