const axios = require("axios");

/**
 * Obfuscates a document by calling the open attestation service with the provided document and fields.
 * @param {Object} document - The document to obfuscate.
 * @param {Array} fields - The fields to obfuscate in the document.
 * @returns {Promise} - A promise that resolves to the obfuscated document response.
 */
const obfuscateDocument = async (document, fields) => {
  // call open attestation service via axios with document and fields
  result = await axios.post(
    process.env.OA_SERVICE_URL + "/api/v1/document/obfuscate",
    {
      document,
      fields,
    },
    {
      headers: {
        Authorization: `${process.env.OA_SERVICE_TOKEN}`,
        "Content-Type": "application/json",
        // Add other headers as needed
      },
    }
  );
  if (result.status !== 200) {
    throw new Error("OA service returned status " + result.status);
  }
  return result.data;
};

module.exports = {
  obfuscateDocument,
};
