export const kycTierInfoRequest = (tier) => {
    tier = tier.toLowerCase()
    const tiers = {
        "login": ["Mobile", "Firstname", "Lastname"],
        "t1_kyc": ["Personal Info", "Email", "ID Information"],
        "t2_kyc": ["Facial Image"],
        "t3_kyc": ["Document Image"],
    }
    if (!tiers[tier]) {
        throw new Error(`Tier ${tier} not found`)
    }
    const result = [];
    result.push(...tiers["login"])
    if (tier === "login") {
        return result
    }
    result.push(...tiers["t1_kyc"])
    if (tier === "t1_kyc") {
        return result
    }
    result.push(...tiers["t2_kyc"])
    if (tier === "t2_kyc") {
        return result
    }
    result.push(...tiers["t3_kyc"])
    return result
}