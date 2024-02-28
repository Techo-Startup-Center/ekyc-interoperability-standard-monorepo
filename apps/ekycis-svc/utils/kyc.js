const { obfuscateDocument } = require("./oa");
// determine tier of kyc through json document
const T0Fields = [
  "user_info.phone_number",
  "user_info.first_name",
  "user_info.last_name",
];
const T1Fields = [
  "user_info.document_type",
  "user_info.document_id",
  "user_info.email",
  "user_info.dob",
  "user_info.gender",
  "user_info.issue_date",
  "user_info.expiry_date",
];

/**
 * Calculates the tier level based on the provided JSON data.
 * @param {string} json - The JSON data.
 * @returns {number} - The tier level.
 */
const getTier = (document) => {
  let tier;
  const data = document.data;
  for (let field of T0Fields) {
    if (!data.user_info.hasOwnProperty(field.split(".")[1])) {
      throw new Error(`Missing ${field} in data`);
    }
  }
  tier = 0;
  for (let field of T1Fields) {
    if (!data.user_info.hasOwnProperty(field.split(".")[1])) {
      return tier;
    }
  }
  tier = 1;
  if (!data.hasOwnProperty("face_image")) {
    return tier;
  }
  tier = 2;
  if (!data.hasOwnProperty("document_image")) {
    return tier;
  }
  return 3;
};

/**
 * Retrieves the obfuscation fields based on the request and target tiers.
 * @param {number} request - The request tier.
 * @param {number} target - The target tier.
 * @returns {string[]} - The obfuscation fields.
 */
const getObfuscationFields = (request, target) => {
  if (request < target) {
    throw new Error("Request tier is lower than target tier");
  }
  let currentTier = request;
  fields = [];
  if (currentTier === 3 && currentTier > target) {
    fields.push("document_image");
    currentTier = 2;
  }
  if (currentTier === 2 && currentTier > target) {
    fields.push("face_image");
    currentTier = 1;
  }
  if (currentTier === 1 && currentTier > target) {
    fields = fields.concat(T1Fields);
    currentTier = 0;
  }
  return fields;
};

/**
 * Converts the document to the specified tier by obfuscating certain fields.
 * @param {Object} document - The document to be converted.
 * @param {string} tier - The target tier to convert the document to.
 * @returns {Promise<Object>} - The converted document.
 */
const tierConversion = async (document, tier) => {
  const requestTier = getTier(document);
  const targetTier = tier;
  const obfuscationFields = getObfuscationFields(requestTier, targetTier);
  return await obfuscateDocument(document, obfuscationFields);
};

module.exports = {
  getTier,
  getObfuscationFields,
  tierConversion,
};
