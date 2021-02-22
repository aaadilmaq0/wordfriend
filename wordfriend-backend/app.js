const config = require("./config/config");

// Express Setup
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const xFrameOptions = require("x-frame-options");
const connectLivereload = require("connect-livereload");
const errorhandler = require("errorhandler");


// New Express App
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(compression());
app.use(passport.initialize());
app.use(cookieParser());
app.use(xFrameOptions());

if(config.mode==="dev"){
    app.use(connectLivereload());
    app.use(errorhandler());
}

module.exports = app;