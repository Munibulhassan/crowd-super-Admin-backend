const workforceService = require("../../service/user.service");

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
          message: "user already existed",
        });
      req.body.percentage = parseFloat((Object.keys(req.body).length / 18) * 100).toFixed(2);
      if (req.body.percentage == 100) {
        req.body.status = "active";
      } else {
        req.body.status = "inactive";
      }
      
      const result = await workforceService.Model.create(req.body);
      
      const data = await workforceService.Model.findOneAndUpdate({_id:result._id},{employeeid:result._id.toString().slice(-5)},{
        new: true,
      });


      res.status(200).send({
        status: 200,
        success: true,
        message: "Created Successfully",
        data,
      });
    } catch (error) {
      console.log(error)
      res
        .status(500)
        .send({ status: 500, success: false, message: error.message });
    }
  }

  async search(req, res) {
    try {
      req.query = Object.fromEntries(
        Object.entries(req.query).filter(([_, v]) => v != "")
      );
      const data = await workforceService.Model.find(req.query)
      if (data.length == 0) {
        return res.status(200).send({
          status: 200,
          success: false,
          message: "No data found",
          data: [],
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        message: "Data found",
        data,
      });
      // const { firstName, lastName, email, employeeid } = req.query;
      // if (employeeid) {
      //   const data = await workforceService.Model.find({ employeeid });
      //   if (data.length == 0) {
      //     return res.status(200).send({
      //       status: 200,
      //       success: false,
      //       message: "No data found",
      //       data: [],
      //     });
      //   }
      //   return res.status(200).send({
      //     status: 200,
      //     success: true,
      //     message: "Data found",
      //     data,
      //   });
      // } else if (email) {
      //   const data = await workforceService.Model.find({ email });
      //   if (data.length == 0) {
      //     return res.status(200).send({
      //       status: 200,
      //       success: false,
      //       message: "No data found",
      //       data: [],
      //     });
      //   }
      //   return res.status(200).send({
      //     status: 200,
      //     success: true,
      //     message: "Data found",
      //     data,
      //   });
      // } else if (firstName && lastName) {
      //   const data = await workforceService.Model.find({
      //     $expr: {
      //       $eq: [
      //         { $concat: ["$firstName", " ", "$lastName"] },
      //         firstName + " " + lastName,
      //       ],
      //     },
      //   });
      //   if (data.length == 0) {
      //     return res.status(200).send({
      //       status: 200,
      //       success: false,
      //       message: "No data found",
      //       data: [],
      //     });
      //   }
      //   return res.status(200).send({
      //     status: 200,
      //     success: true,
      //     message: "Data found",
      //     data,
      //   });
      // } else {
      //   const data = await workforceService.Model.find();
      //   if (data.length == 0) {
      //     return res.status(200).send({
      //       status: 200,
      //       success: false,
      //       message: "No data found",
      //       data: [],
      //     });
      //   }
      //   return res.status(200).send({
      //     status: 200,
      //     success: true,
      //     message: "Data found",
      //     data,
      //   });
      // }
    } catch (error) {
      res
        .status(500)
        .send({ status: 500, success: false, message: error.message });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        return res.send({
          success: false,
          status: 200,
          message: "All input is required",
        });
      }

      const data = await workforceService.Model.findOne({ email, password });
      if (!data) {
        return res.status(200).send({
          status: 200,
          success: false,
          message: "Invalid credentials",
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        message: "Successfully login",
        data,
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
      let data = await workforceService.Model.findById(id, { _id: 1, zone: 1 });

      if (!data)
        return res.send({
          success: true,
          status: 403,
          message: "invalid id",
        });

      
        
      data = await workforceService.Model.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });

      res.status(200).send({
        status: 200,
        success: true,
        message: "Updated Successfully",
        data,
      });
    } catch (error) {
      res.status(500).send({ status: 500, success: false, message: error.message });
    }
  }

  async getAllHeadCount(req, res) {
    try {
      const userExisted = await workforceService.Model.find({});

      if (userExisted.length == 0)
        return res.status(200).send({
          status: 200,
          success: true,
          message: "No data found",
          data: [],
        });

      res.status(200).send({
        status: 200,
        success: true,
        message: "Fetched Successfully",
        data: userExisted,
      });
    } catch (error) {
      res
        .status(500)
        .send({ status: 500, success: false, message: error.message });
    }
  }
  async imageupload(req, res) {
    try {
      res.status(200).json({
        success: true,
        file: req.file.filename,
      });
    } catch (err) {
      await deleteFile(req.file.fileName, "/upload/user");
      res
        .status(500)
        .send({ status: 500, success: false, message: error.message });
    }
  }
  async forgotpassword(req, res) {
    try {
      if (!req.body.email) {
        return res
          .status(200)
          .send({ status: 200, success: false, message: "Email required" });
      }
      const data = await workforceService.Model.findOne({
        email: req.body.email,
      });
      if (!data) {
        return res.status(200).send({
          status: 200,
          success: false,
          message: "No Any user of this email exist",
        });
      }
      // data.email()
    } catch (error) {
      res
        .status(500)
        .send({ status: 500, success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      let { id } = req.params;
      let data = await workforceService.Model.findById(id, { _id: 1 });

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

      data = await workforceService.Model.findOneAndUpdate(
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
        message: "User uploaded Successfully",
        result,
      });
    } catch (error) {
      console.log(error)
      await deleteFile(fileName, folder);
      res
        .status(500)
        .send({ status: 500, success: false, message: error.message });
    }
  }
}

const usersController = new Users();
module.exports = usersController;
