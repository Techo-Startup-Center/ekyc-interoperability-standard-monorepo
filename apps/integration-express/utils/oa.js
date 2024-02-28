const PersonalInfo = require("../dto/personal_info");
const Tier3 = require("../dto/tier3");
const ErrorCode = require("../errors/error_code");
const User = require("../models/user");
const axios = require("axios");
const verifyOAeKYC = async (oa_doc) => {
    const oaHelperVerifyEndpoint = process.env.OA_HELPER_URL + "/api/v1/verify";
    try {
        const response = await axios.post(oaHelperVerifyEndpoint, oa_doc, {
            headers: { "Content-Type": "application/json" },
        });
        if (response.status !== 200) {
            console.log(`Error verifying oa: ${response.data.message}`)
            throw new ErrorCode("Invalid token", 400);
        }
        const retries = process.env.OA_VERIFY_RETRIES;
        const interval = process.env.OA_VERIFY_INTERVAL_MS;
        for (let i = 0; i < retries; i++) {
            const isJsonValid = verifyJsonRespond(response.data);
            if (isJsonValid) {
                return response.data.data;
            }
            await sleep(interval);
        }
        throw new ErrorCode("Invalid eKYC attestation", 500);
    } catch (e) {
        console.error(e);
        throw new ErrorCode("Internal Server Error", 500);
    }
}

const verifyJsonRespond = (json) => {
    const results = json.results;
    respond = [];
    if (!results && results.length === 0) {
        throw new ErrorCode("Invalid eKYC attestation", 500)
    }
    for (let i = 0; i < results.length; i++) {
        respond.push(results[i].status === "VALID");
    }
    // if respond array contains false then return false else return true
    return respond.includes(false) ? false : true;
}

const wrapOAeKYC = async (user) => {
    const user_info = new PersonalInfo(
        user.phone_number, user.first_name, user.last_name, user.document_type, user.document_id, user.email, user.dob, user.gender, user.issue_date, user.expiry_date
    )
    const tier3 = new Tier3(user_info, user.face_image, user.document_image);
    const oaHelperWrapEndpoint = process.env.OA_HELPER_URL + "/api/v1/document/wrap";
    try {
        const response = await axios.post(oaHelperWrapEndpoint, tier3, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": process.env.OA_AUTH_KEY
            },
        });
        if (response.status !== 200) {
            console.log(`Error wrapping oa: ${response.data.message}`)
            throw new ErrorCode("Internal Server Error", 500);
        }
        return response.data;
    } catch (e) {
        console.error(e);
        throw new ErrorCode("Internal Server Error", 500);
    }
}

const sample_oa_doc = {
    "results": [
        {
            "issuer": {
                "documentStore": "0xcdf4822C3028EcDF82277F617cbb4f7f7d5932B0",
                "identityProof": {
                    "location": "ekycis-demo.svathana.com",
                    "type": "DNS-TXT"
                },
                "name": "EKYC Interoperability Standard - Demo",
                "url": "https://ekycis-demo.svathana.com"
            },
            "status": "VALID"
        }
    ],
    "data": {
        "$template": {
            "name": "EKYC_INTEROP_STANDARD_V1",
            "type": "EMBEDDED_RENDERER"
        },
        "user_info": {
            "phone_number": "+85512987456",
            "first_name": "Somnang",
            "last_name": "Mean"
        },
        "issuers": [
            {
                "documentStore": "0xcdf4822C3028EcDF82277F617cbb4f7f7d5932B0",
                "identityProof": {
                    "location": "ekycis-demo.svathana.com",
                    "type": "DNS-TXT"
                },
                "name": "EKYC Interoperability Standard - Demo",
                "url": "https://ekycis-demo.svathana.com"
            }
        ]
    }
};

module.exports = {
    verifyOAeKYC,
    wrapOAeKYC
}