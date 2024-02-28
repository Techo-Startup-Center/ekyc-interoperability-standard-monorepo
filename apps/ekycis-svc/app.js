var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");
const moment = require("moment");
const jwtRoute = require("./routes/jwt");
const kycRoute = require("./routes/kyc");
require("dotenv").config();
var app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "25mb" }));

app.use("/api/v1/jwt", jwtRoute);
app.use("/api/v1/kyc", kycRoute);

const PORT = process.env.PORT || 3000;

app.use(function (req, res, next) {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      `INFO ${moment().toISOString()} - Server started successfully on port: ${PORT}`
    );
  } else {
    console.log(
      `ERROR ${moment().toISOString()} - Failed to start server error: ${error}`
    );
  }
});

module.exports = app;
