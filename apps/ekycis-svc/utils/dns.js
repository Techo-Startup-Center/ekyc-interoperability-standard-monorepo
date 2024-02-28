const dns = require("dns");
const util = require("util");

// create method to fetch dns txt from a domain
/**
 * Fetches DNS TXT records for a given domain.
 * @param {string} domain - The domain to fetch DNS TXT records for.
 * @returns {Promise<Array<string>>} - A promise that resolves to an array of DNS TXT records.
 */
const fetchDnsTxt = async (domain) => {
  try {
    const dnsResolve = util.promisify(dns.resolveTxt);
    const records = await dnsResolve(domain);
    return records;
  } catch (err) {
    const error = new Error(
      `Failed to fetch DNS TXT records for domain: ${domain}`
    );
    error.code = "500";
    throw error;
  }
};

/**
 * Extracts JWT public keys from DNS TXT records for a given domain.
 * @param {string} domain - The domain for which to fetch DNS TXT records.
 * @returns {Promise<string[]>} - A promise that resolves to an array of JWT public keys.
 */
const extractJWTPubKeyFromDnsTxt = async (domain) => {
  pubkeys = [];
  // fetch dns txt lines
  const lines = await fetchDnsTxt(domain);
  //loop through lines
  for (let i = 0; i < lines.length; i++) {
    // split text record by space
    const record = lines[i][0].split(" ");
    if (record[0] === "ekyc_jwt") {
      // loop through record from i = 1
      // if record[i].split("=")[0] === "pub" then record[i].split("=")[1] is the public key
      for (let i = 1; i < record.length; i++) {
        const fields = record[i].split("=");
        if (fields[0] === "pub") {
          // split record by '=' sign
          const key = fields[1];
          // decode url encode base64 string
          pubkeys.push(decodeURIComponent(key));
          break;
        }
      }
    }
  }
  return pubkeys;
};

module.exports = {
  extractJWTPubKeyFromDnsTxt,
};
