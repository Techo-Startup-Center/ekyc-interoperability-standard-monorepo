var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var moment = require("moment");
var bodyParser = require('body-parser')
var app = express();

require("dotenv").config(); // load .env file to process
const mongoConnect = require("./config/mongo");
var requestRouter = require("./routes/request");
var provideRouter = require("./routes/provide");

app.use(logger("dev"));
app.use(bodyParser({limit: '50mb'}));
app.use(process.env.API_PREFIX + "/request", requestRouter);
app.use(process.env.API_PREFIX + "/provide", provideRouter)


// * Bootstrap mongo connection
mongoose.connect(mongoConnect);
const database = mongoose.connection;

database.on("error", (err) => {
    console.log(
        `ERROR ${moment().toISOString()} - Failed to connect to database error: ${err}`
    );
});

database.once("connected", () => {
    console.log(
        `INFO ${moment().toISOString()} - Database connection established`
    );
});

// * Not found handler
app.use(function (_, res) {
    res.status(404).send({ code: "NOT_FOUND", message: "Resource not found" });
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        code: err.code || "INTERNAL_SERVER_ERROR",
        code: err.code || "INTERNAL_SERVER_ERROR",
        message: err.message || "An unexpected error has occurred",
    });
});

const PORT = process.env.PORT || 3000;
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

