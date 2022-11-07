const positionService = require("../../../service/position.service");
const _ = require("lodash");
// const excelToMongoService = require("../../../service/excelToMongo.service");

const faService = require("../../../service/fa.service");
const vanuesService = require("../../../service/vanue.service");
const fileService = require("../../../constants/file.constant");
const excelToMongoConstant = require("../../../constants/excelToMongo.constant");
const fs = require("fs");

class Positions {
  async create(req, res) {
    try {
      const { functionarea, venue, jobTitle, workforcetype } = req.body;
      if (!(functionarea && venue && jobTitle && workforcetype)) {
        return res.status(200).send({
          success: false,
          message: "All input is required",
        });
      }

      const data = await positionService.Model.create(req.body);

      res.status(200).send({
        status: 200,
        success: true,
        message: "Created Successfully",
        data,
      });
    } catch (error) {
      res
        .status(500)
        .send({ status: 500, success: false, message: error.message });
    }
  }

  async get(req, res) {
    try {
      let { id } = req.params;
      const data = await positionService.Model.findById(id);
      if (!data)
        return res.send({
          success: true,
          status: 200,
          message: "no data found",
        });

      res.status(200).send({
        status: 200,
        success: true,
        message: "Fetched Successfully",
        data,
      });
    } catch (error) {
      res
        .status(500)
        .send({ status: 500, success: false, message: error.message });
    }
  }

  async gets(req, res) {
    try {
      const query = Object.fromEntries(
        Object.entries(req.query).filter(([_, v]) => v != "")
      );

      let data = await positionService.Model.find(query)
        .populate("functionarea")
        .populate("venue");

      if (data.length == 0)
        return res.send({
          success: true,
          status: 200,
          message: "no data found",
          data: [],
        });
      const filterdata = data.sort(function(a, b) {
        var textA = a.functionarea.functionalarea.toUpperCase();
        var textB = b.functionarea.functionalarea.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
console.log(filterdata)

      res.status(200).send({
        status: 200,
        success: true,
        message: "Fetched Successfully",
        count: data.length,
    data: filterdata,
      });
    } catch (error) {
      res
        .status(500)
        .send({ status: 500, success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      let { id } = req.params;
      let data = await positionService.Model.findById(id, { _id: 1 });

      // if(_.isEqual(data._doc,req.body)) return res.send({
      //   success: true,
      //   status: 200,
      //   message: "record is already upto date",
      // });

      if (!data)
        return res.send({
          success: true,
          status: 403,
          message: "invalid id",
        });

      data = await positionService.Model.findOneAndUpdate(
        { _id: id },
        req.body,
        {
          new: true,
        }
      );

      res.status(200).send({
        status: 200,
        success: true,
        message: "Updated Successfully",
        data,
      });
    } catch (error) {
      res
        .status(500)
        .send({ status: 500, success: false, message: error.message });
    }
  }

  async upload(req, res) {
    const sheetName = "Sheet1";
    const folder = "/upload/";
    const skipRow = 1;
    const fileName = req.file.filename;
    try {
      // return
      const keysMapping = {
        A: "FA_Code",
        B: "Venue_Name",
        C: "Workforce_Type",
        D: "Job_Title",
        E: "Start_Date",
        F: "End_Date",
        G: "Total_Demand",
        H: "Peak_Shift",
        I: "Shifts_per day",
      };
      let excelData = await excelToMongoConstant.excelToJsonConversion(
        keysMapping,
        fileName,
        folder,
        sheetName,
        skipRow
      );

      const data = excelData["Sheet1"];

      // function groupBy(data, key) {
      //   return data.reduce((acc, cur) => {
      //     acc[cur[key]] = acc[cur[key]] || [];
      //   });
      // }

      const arr = [];
      data.map(async (item, index) => {
        const functionid = await faService.Model.find({ facode: item.FA_Code });
        const venueid = await vanuesService.Model.find({
          venuename: item.Venue_Name,
        });

        arr.push({
          functionarea: functionid[0]?._id,
          venue: venueid[0]?._id,
          workforcetype: item.Workforce_Type,
          jobTitle: item.Job_Title,
          startDate: item.Start_Date,
          endDate: item.End_Date,
          totalDemand: item.Total_Demand,
          peakShift: item.Peak_Shift,
          shiftsPerDay: item.Shifts_per_day,
        });
        if (arr.length == data.length) {
          let positiondata = await positionService.Model.insertMany(arr);

          await fileService.deleteFile(fileName, folder);

          res.status(200).send({
            status: 200,
            success: true,
            message: "All positions Inserted Successfully",
            positiondata,
          });
        }
      });
    } catch (error) {
      await fileService.deleteFile(fileName, folder);
      res
        .status(500)
        .send({ status: 500, success: false, message: error.message });
    }
  }
  async delete(req, res) {
    try {
      let { id } = req.params;
      let data = await positionService.Model.findById(id, { _id: 1 });
      if (!data)
        return res.send({
          success: true,
          status: 403,
          message: "invalid id",
        });
      data = await positionService.Model.findByIdAndRemove(id);

      res.status(200).send({
        status: 200,
        success: true,
        message: "Deleted Successfully",
        data,
      });
    } catch (error) {
      res
        .status(500)
        .send({ status: 500, success: false, message: error.message });
    }
  }
}

const positionsController = new Positions();
module.exports = positionsController;
