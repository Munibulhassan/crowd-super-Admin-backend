const excelToMongoService = require("../../../service/excelToMongo.service");

const fileService = require("../../../constants/file.constant");
const excelToMongoConstant = require("../../../constants/excelToMongo.constant");
const fs = require("fs");


class ExcelToMongo {
  async create(req, res) {
    const sheetName = "Sheet1";
    const folder = "/upload/";
    const skipRow = 1
    const fileName = req.file.filename;
    try {
      // return
      const keysMapping = {
        A: "functionalarea",
        B: "facode",
        C: "jobtype",
        D: "jobtitle",
        E: "venuename",
        F: "venuecode",
        
      };
      let excelData = await excelToMongoConstant.excelToJsonConversion(keysMapping,fileName, folder, sheetName, skipRow)
      
      let data = await excelToMongoService.Model.insertMany(excelData["Sheet1"]);

      await fileService.deleteFile(fileName,folder)
      
      res.status(200).send({
        status: 200,
        success: true,
        msg: "Created Successfully",
        data,
      });

    } catch (error) {
      await fileService.deleteFile(fileName,folder)
      res.status(500).send({ status: 500, success: false, msg: error.message });
    }
  }
}

const excelToMongoController = new ExcelToMongo();
module.exports = excelToMongoController;
