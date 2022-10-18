const workforceService = require("../../service/workforce.service");

const excelToMongoConstant = require("../../constants/excelToMongo.constant");
const { deleteFile } = require("../../constants/file.constant");

class Users {
  async create(req, res) {
    try {
      const userExisted = await workforceService.Model.findOne({
        email: req.body.email,
      });

      if (userExisted)
        return res.send({
          success: true,
          status: 200,
          msg: "user already existed",
        });
      req.body.percentage = (Object.keys(req.body).length / 18) * 100;
      if (req.body.percentage >= 100) {
        req.body.status = "active";
      } else {
        req.body.status = "inactive";
      }

      const result = await workforceService.Model.create(req.body);

      res.status(200).send({
        status: 200,
        success: true,
        msg: "Created Successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).send({ status: 500, success: false, msg: error.message });
    }
  }

  async search(req, res) {
    try {
      req.query = Object.fromEntries(
        Object.entries(req.query).filter(([_, v]) => v != "")
      );

      const { firstName, lastName, email, _id } = req.query;
      if (_id) {
        const data = await workforceService.Model.find({ _id });
        if (data.length == 0) {
          return res.status(200).send({
            status: 200,
            success: false,
            msg: "No data found",
            data: [],
          });
        }
        return res.status(200).send({
          status: 200,
          success: true,
          msg: "Data found",
          data,
        });
      } else if (email) {
        const data = await workforceService.Model.find({ email });
        if (data.length == 0) {
          return res.status(200).send({
            status: 200,
            success: false,
            msg: "No data found",
            data: [],
          });
        }
        return res.status(200).send({
          status: 200,
          success: true,
          msg: "Data found",
          data,
        });
      } else if (firstName && lastName) {


        const data = await workforceService.Model.find({
          $expr: {
            $eq: [
              { $concat: ["$firstName", " ", "$lastName"] },
              firstName + " " + lastName,
            ],
          },
        });
        if (data.length == 0) {
          return res.status(200).send({
            status: 200,
            success: false,
            msg: "No data found",
            data: [],
          });
        }
        return res.status(200).send({
          status: 200,
          success: true,
          msg: "Data found",
          data,
        });
      } else {
        const data = await workforceService.Model.find();
        if (data.length == 0) {
          return res.status(200).send({
            status: 200,
            success: false,
            msg: "No data found",
            data: [],
          });
        }
        return res.status(200).send({
          status: 200,
          success: true,
          msg: "Data found",
          data,
        });
      }
    } catch (error) {
      res.status(500).send({ status: 500, success: false, msg: error.message });
    }
  }

  async getAllHeadCount(req, res) {
    try {
      const userExisted = await workforceService.getAllHeadCount();

      if (userExisted.length == 0)
        return res.status(200).send({
          status: 200,
          success: true,
          msg: "No data found",
          data: [],
        });

      res.status(200).send({
        status: 200,
        success: true,
        msg: "Fetched Successfully",
        data: userExisted,
      });
    } catch (error) {
      res.status(500).send({ status: 500, success: false, msg: error.message });
    }
  }
  async imageupload(req, res) {
    try {
      const { id } = req.params;
      const userExisted = await workforceService.Model.findOne({
        _id: id,
      });

      // if (!userExisted) {
      //   await deleteFile(req.file.fileName, "/upload/user");
      //   return res.send({
      //     success: true,
      //     status: 200,
      //     msg: "user Not exist",
      //   });
      // }else{
      // const result = await workforceService.Model.updateOne({_id:id},{image:req.file.filename});
      // res.status(200).send({
      //   status: 200,
      //   success: true,
      //   msg: "User image is uploaded",
      //   result,
      // });
 
      // }
    } catch (err) {
      await deleteFile(req.file.fileName, "/upload/user");
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
        A: "firstName",
        B: "lastName",
        C: "email",
        D: "password",
        E: "dataOfBirth",
        F: "phone",
        G: "gender",
        H: "jobtype",
      };
      let excelData = await excelToMongoConstant.excelToJsonConversion(
        keysMapping,
        fileName,
        folder,
        sheetName,
        skipRow
      );
      const data = excelData["Sheet1"];
      const result = await workforceService.Model.insertMany(data);

      await deleteFile(fileName, folder);
      res.status(200).send({
        status: 200,
        success: true,
        msg: "User uploaded Successfully",
        result,
      });
    } catch (error) {
      await deleteFile(fileName, folder);
      res.status(500).send({ status: 500, success: false, msg: error.message });
    }
  }
}

const usersController = new Users();
module.exports = usersController;
