const express = require("express");
const router = express.Router();
const { getTier, tierConversion } = require("../utils/kyc");

router.use(express.json({ limit: "10mb" }));
router.use(express.urlencoded({ limit: "10mb", extended: true }));

router.post("/check", (req, res) => {
  const tierResult = getTier(req.body.document);
  try {
    res.send({ tier: tierResult, document: req.body });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post("/convert", async (req, res) => {
  try {
    res.send({
      obfuscate_document: await tierConversion(
        req.body.document,
        req.body.target_tier
      ),
      tier: req.body.target_tier,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
