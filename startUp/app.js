'use strict';
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const appRoot = require('app-root-path')
const compression = require('compression');
var app = express();
const cors = require("cors");
const fs = require('fs')
const fileupload = require("express-fileupload");

app.use(
  fileupload({
    createParentPath: true,
  })
);

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

app.get("/image/:folder/:image", (req, res) => {

    fs.readFile("upload/"+req.params.folder+"/"+req.params.image, function (err, data) {
      if (err) throw err; // Fail if the file can't be read.
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.end(data); // Send the file data to the browser.
    });
  });

app.use("/api", require("../routes/api"));


app.use(express.static(__dirname + "/upload"));


module.exports = app;