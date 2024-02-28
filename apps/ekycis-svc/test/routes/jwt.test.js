require("dotenv").config({ path: ".env.test" });

const router = require("../../routes/jwt");
const request = require("supertest");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

const app = express();
app.use(express.json());
app.use("/", router);

jest.setTimeout(300000); // 5 minutes

describe("POST generate and verify token", () => {
  let requestToken;
  it("should respond with a JWT", async () => {
    const response = await request(app)
      .post("/generate")
      .send({
        type: "ekyc_interop_request_v1",
        mode: "LOGIN",
        session_id: uuidv4(),
        exchange_mode: "DIRECT_API",
        callback: "https://ekycis-demo.svathana.com/callback",
        mode: "POST",
        iss: "ekycis-demo.svathana.com",
        iat: moment().unix(),
        exp: moment().add(1, "day").unix(),
      });
    requestToken = response.body.token;
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
  it("should verify the JWT and respond with the payload", async () => {
    const response = await request(app)
      .post("/verify")
      .send({ token: requestToken });
    if (response.statusCode !== 200) {
      console.log(JSON.stringify(response.error.text));
    }
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("payload");
  });
});
describe("POST generate auth token, create fetch payload and verify fetch payload", () => {
  let authToken;
  let fetchPayload;
  it("should generate auth token", async () => {
    const response = await request(app)
      .post("/generate")
      .send({
        type: "ekyc_interop_auth_v1",
        template: "LOGIN",
        auth_id: uuidv4(),
        url: "https://ekycis-demo.svathana.com/auth",
        exchange_mode: "DIRECT_API",
        iss: "ekycis-demo.svathana.com",
        iat: moment().unix(),
        exp: moment().add(1, "day").unix(),
      });
    authToken = response.body.token;
    if (response.statusCode !== 200) {
      console.log(JSON.stringify(response.error.text));
    }
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
  it("should pass auth token validation", async () => {
    const response = await request(app)
      .post("/verify")
      .send({ token: authToken });
    if (response.statusCode !== 200) {
      console.log(JSON.stringify(response.error.text));
    }
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("payload");
  });
  it("should create fetch payload", async () => {
    const response = await request(app).post("/fetch-sign").send({
      auth_token: authToken,
    });
    fetchPayload = response.body;
    if (response.statusCode !== 200) {
      console.log(JSON.stringify(response.error.text));
    }
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("auth_token");
    expect(response.body).toHaveProperty("signature");
  });
  it("should pass fetch payload validation", async () => {
    fetchPayload.fetch_domain = "ekycis-demo.svathana.com";
    const response = await request(app)
      .post("/fetch-verify")
      .send(fetchPayload);
    if (response.statusCode !== 200) {
      console.log(JSON.stringify(response.error.text));
    }
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("payload");
    expect(response.body).toHaveProperty("valid");
    expect(response.body.valid).toBe(true);
  });
});
