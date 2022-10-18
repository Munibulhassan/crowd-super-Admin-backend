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
    
    const {
      funciton,venue,jobTitle,workforcetype
    } = req.body
    if(!(funciton&&venue&&jobTitle&&workforcetype)){
      return res.status(200).send({
        success:false,
        message:"All input is required"
      })
    }

    const data = await positionService.Model.create(req.body);

      res.status(200).send({
        status: 200,
        success: true,
        msg: "Created Successfully",
        data,
      });
    } catch (error) {
      res.status(500).send({ status: 500, success: false, msg: error.message });
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
          msg: "no data found",
        });

      res.status(200).send({
        status: 200,
        success: true,
        msg: "Fetched Successfully",
        data,
      });
    } catch (error) {
      res.status(500).send({ status: 500, success: false, msg: error.message });
    }
  }

  async gets(req, res) {
    try {
      let data = await positionService.Model.find();
      if (data.length == 0)
        return res.send({
          success: true,
          status: 200,
          msg: "no data found",
          data: [],
        });

      res.status(200).send({
        status: 200,
        success: true,
        msg: "Fetched Successfully",
        count: data.length,
        data,
      });
    } catch (error) {
      res.status(500).send({ status: 500, success: false, msg: error.message });
    }
  }

  async update(req, res) {
    try {
      let { id } = req.params;
      let data = await positionService.Model.findById(id, { _id: 1 });

      // if(_.isEqual(data._doc,req.body)) return res.send({
      //   success: true,
      //   status: 200,
      //   msg: "record is already upto date",
      // });

      if (!data)
        return res.send({
          success: true,
          status: 403,
          msg: "invalid id",
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
        msg: "Updated Successfully",
        data,
      });
    } catch (error) {
      res.status(500).send({ status: 500, success: false, msg: error.message });
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
        B: "Venue_Code",
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
          venuecode: item.Venue_Code.toUpperCase(),
        });

        arr.push({
          function: functionid[0]?._id,
          venue: venueid[0]?._id,
          workforcetype: item.Workforce_Type,
          jobTitle: item.Job_Title,
          startDate: item.Start_Date,
          endDate: item.End_Date,
          totalDemand: item.Total_Demand,
          peakShift: item.Peak_Shift,
          shiftsPerDay: item.Shifts_per_day,
        });
        if (index == data.length - 1) {
          
          let positiondata = await positionService.Model.insertMany(arr);

          
          await fileService.deleteFile(fileName, folder);

          res.status(200).send({
            status: 200,
            success: true,
            msg: "All positions Inserted Successfully",
            positiondata,
          });
        }
      });
    } catch (error) {
      await fileService.deleteFile(fileName, folder);
      res.status(500).send({ status: 500, success: false, msg: error.message });
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
          msg: "invalid id",
        });
      data = await positionService.Model.findByIdAndRemove(id);

      res.status(200).send({
        status: 200,
        success: true,
        msg: "Deleted Successfully",
        data,
      });
    } catch (error) {
      res.status(500).send({ status: 500, success: false, msg: error.message });
    }
  }
}

const positionsController = new Positions();
module.exports = positionsController;
