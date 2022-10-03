'use strict';
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const appRoot = require('app-root-path')
const cors = require("cors");
const compression = require('compression');
var app = express();

app.use(cors());

app.use((req, res, next) => {
    console.log(req.url)
    next()
})
app.use(compression())

// Express TCP requests parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

// Static rendering
app.use(express.static("views"));
app.use('/public', express.static(path.join(appRoot.path, "public")));
app.set("view engine", "ejs");


app.use("/api", require("../routes/api"));


app.use(express.static(__dirname + "/upload"));


module.exports = app;