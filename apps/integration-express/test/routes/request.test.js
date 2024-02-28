const express = require("express");
const request = require("supertest");
const router = require("../../routes/requester");
require("dotenv").config({ path: "./.env.test" });

const app = express();
app.use(express.json("limit: 50mb"));
app.use('/', router)

jest.setTimeout(300000); // 5 minutes

describe("Flow of Request test", () => {
    test("It should response the GET method", async () => {
        const response = await request(app).get("/new");
        expect(response.statusCode).toBe(200);
    });
});

