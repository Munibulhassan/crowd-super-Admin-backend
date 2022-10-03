"use strict";

const fs = require("fs");
const appRoot = require("app-root-path");

const readFile = (path) => {
  return new Promise((resolve, rejects) => {
    try {
      fs.readFile(path, "utf8", (err, data) => {
        resolve(data);
      });
    } catch (error) {
      rejects(error);
    }
  });
};

const deleteFile = function (fileName, folderPath) {
  return new Promise(function (resolve, reject) {
    try {
      // const rootPath = path.join(appRoot.path, `/public/${image}`.trim())
      fs.unlink(appRoot.resolve(`${folderPath}${fileName}`), (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  readFile,
  deleteFile,
};
