require("dotenv").config({ path: ".env.test" });

const request = require("supertest");
const express = require("express");
const router = require("../../routes/kyc");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json({ limit: process.env.SIZE_LIMIT }));
app.use("/", router);

jest.setTimeout(300000); // 5 minutes

describe("POST /check", () => {
  it("should respond with a tier and document", async () => {
    const files = [
      {
        file: "../static/login.json",
        tier: 0,
      },
      {
        file: "../static/tier-one.json",
        tier: 1,
      },
      {
        file: "../static/tier-two.json",
        tier: 2,
      },
      {
        file: "../static/tier-three.json",
        tier: 3,
      },
    ];
    for (i = 0; i < files.length; i++) {
      const content = fs.readFileSync(
        path.join(__dirname, files[i].file),
        "utf8"
      );
      jsonObject = JSON.parse(content);
      const response = await request(app)
        .post("/check")
        .send({ document: jsonObject });
      if (response.statusCode !== 200) {
        console.log(JSON.stringify(response.error.text));
      }
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("tier");
      expect(response.body).toHaveProperty("document");
      expect(response.body.tier).toBe(files[i].tier);
    }
  });
  it("should convert tier 3 document to tier 2", async () => {
    const content = fs.readFileSync(
      path.join(__dirname, "../static/tier-three.json"),
      "utf8"
    );
    jsonObject = JSON.parse(content);
    let response = await request(app)
      .post("/convert")
      .send({ document: jsonObject, target_tier: 2 });
    if (response.statusCode !== 200) {
      console.log(JSON.stringify(response.error.text));
    }
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("obfuscate_document");
    // check that the document is tier 2
    response = await request(app)
      .post("/check")
      .send({ document: response.body.obfuscate_document });
    if (response.statusCode !== 200) {
      console.log(JSON.stringify(response.error.text));
    }
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("tier");
    expect(response.body).toHaveProperty("document");
    expect(response.body.tier).toBe(2);
  });
  it("should convert tier 3 document to tier 1", async () => {
    const content = fs.readFileSync(
      path.join(__dirname, "../static/tier-three.json"),
      "utf8"
    );
    jsonObject = JSON.parse(content);
    let response = await request(app)
      .post("/convert")
      .send({ document: jsonObject, target_tier: 1 });
    if (response.statusCode !== 200) {
      console.log(JSON.stringify(response.error.text));
    }
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("obfuscate_document");
    // check that the document is tier 1
    response = await request(app)
      .post("/check")
      .send({ document: response.body.obfuscate_document });
    if (response.statusCode !== 200) {
      console.log(JSON.stringify(response.error.text));
    }
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("tier");
    expect(response.body).toHaveProperty("document");
    expect(response.body.tier).toBe(1);
  }),
    it("should convert tier 3 document to tier 0", async () => {
      const content = fs.readFileSync(
        path.join(__dirname, "../static/tier-three.json"),
        "utf8"
      );
      jsonObject = JSON.parse(content);
      let response = await request(app)
        .post("/convert")
        .send({ document: jsonObject, target_tier: 0 });
      if (response.statusCode !== 200) {
        console.log(JSON.stringify(response.error.text));
      }
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("obfuscate_document");
      // check that the document is tier 0
      response = await request(app)
        .post("/check")
        .send({ document: response.body.obfuscate_document });
      if (response.statusCode !== 200) {
        console.log(JSON.stringify(response.error.text));
      }
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("tier");
      expect(response.body).toHaveProperty("document");
      expect(response.body.tier).toBe(0);
    });
});

describe("Prevent convert document to lower tier", () => {
  it("should not convert tier 1 document to tier 2", async () => {
    const content = fs.readFileSync(
      path.join(__dirname, "../static/tier-one.json"),
      "utf8"
    );
    jsonObject = JSON.parse(content);
    let response = await request(app)
      .post("/convert")
      .send({ document: jsonObject, target_tier: 2 });
    if (response.statusCode !== 400) {
      console.log(JSON.stringify(response.error.text));
    }
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "Request tier is lower than target tier"
    );
  });
  it("should not convert tier 2 document to tier 3", async () => {
    const content = fs.readFileSync(
      path.join(__dirname, "../static/tier-two.json"),
      "utf8"
    );
    jsonObject = JSON.parse(content);
    let response = await request(app)
      .post("/convert")
      .send({ document: jsonObject, target_tier: 3 });
    if (response.statusCode !== 400) {
      console.log(JSON.stringify(response.error.text));
    }
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "Request tier is lower than target tier"
    );
  });
  it("should not convert tier 1 document to tier 3", async () => {
    const content = fs.readFileSync(
      path.join(__dirname, "../static/tier-one.json"),
      "utf8"
    );
    jsonObject = JSON.parse(content);
    let response = await request(app)
      .post("/convert")
      .send({ document: jsonObject, target_tier: 3 });
    if (response.statusCode !== 400) {
      console.log(JSON.stringify(response.error.text));
    }
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "Request tier is lower than target tier"
    );
  });
});
