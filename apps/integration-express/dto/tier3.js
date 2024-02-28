class Tier3 {
    constructor(userInfo, faceImage, documentImage) {
        this.$template = {
            name: "EKYC_INTEROP_STANDARD_V1",
            type: "EMBEDDED_RENDERER"
        };
        this.user_info = userInfo;
        this.face_image = faceImage;
        this.document_image = documentImage;
    }
}

module.exports = Tier3;

// const tier3 = new Tier3(
//     {
//         phone_number: "+85512987456",
//         first_name: "Somnang",
//         last_name: "Mean",
//         document_type: "KM_ID",
//         document_id: "978564321",
//         email: "somnangmean4321@gmail.com",
//         dob: "1976-10-11",
//         gender: "M",
//         issue_date: "2015-03-21",
//         expiry_date: "2025-03-20"
//     },
//     "BASE64_ENCODED_IMAGE",
//     "BASE64_ENCODED_IMAGE"
// );
