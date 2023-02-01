const workforceService = require("../../service/user.service");

const excelToMongoConstant = require("../../constants/excelToMongo.constant");
const { deleteFile } = require("../../constants/file.constant");
const { WorkforcePermission } = require("../../models/workforcepermission.model");
const { createShortUuid } = require("../../utils/common");
const fs = require('fs')

const UserPropertyCount = 13

class Users {
  async create(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        phone,
        workforcetype,
        functionalarea,
        gender,
        address,
      } = req.body;
      if (
        !(
          firstName &&
          lastName &&
          email &&
          password &&
          dateOfBirth &&
          phone &&
          workforcetype &&
          functionalarea &&
          gender &&
          address
        )
      ) {
        return res.send({
          success: false,
          status: 200,
          message: "All input is required",
        });
      }
      const userExisted = await workforceService.Model.findOne({
        email: req.body.email,
      });

      if (userExisted)
        return res.send({
          success: false,
          status: 200,
          message: "user already existed",
        });

      console.log("Request:", req.body)
      req.body.percentage = parseFloat(
        (Object.keys(req.body).length / UserPropertyCount) * 100
      ).toFixed(2);
      if (req.body.percentage == 100) {
        req.body.status = "active";
      } else {
        req.body.status = "inactive";
      }

      const result = await workforceService.Model.create(req.body);

      const data = await workforceService.Model.findOneAndUpdate(
        { _id: result._id },
        { employeeid: result._id.toString().slice(-6) },
        {
          new: true,
        }
      );

      res.status(200).send({
        status: 200,
        success: true,
        message: "Created Successfully",
        data,
      });
    } catch (error) {
      console.log(error);
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
      const data = await workforceService.Model.find(req.query);
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
      let data = await workforceService.Model.findById(id, {
        _id: 1,
        zone: 1,
        editimage: 1,
      });

      if (!data) {
        return res.send({
          success: false,
          status: 200,
          message: "invalid id",
        });
      }
      if (req.body.profileimage && data.editimage == false) {
        return res.send({
          success: false,
          status: 200,
          message: "You can't add image restricted by Super Admin",
        });
      }

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

        // let avatar = req.files.avatar;
        // if(Array.isArray(avatar)===false){
        //   avatar = [avatar];
        // }
        // len = avatar.length;
        // let fileNames = [];
        // for(let i=0;i<len;i++){
        //   avatar[i].mv("./uploads/" + avatar[i].name);
        //   fileNames.push(avatar[i].name);
        // }
        // Use the mv() method to place the file in upload directory
  

  async updateProfileById(req, res) {
    try {
      let { _id } = req.body;
      let data = await workforceService.Model.findById(_id);
      console.log('NewData: ', req.body, req.files)
      if(data && req.files.profileimage) {
        console.log("profile", data.profileimage)
        let newprofilename = new Date().getTime() + req.files.profileimage.name
        req.files.profileimage.mv(`./upload/profile/${newprofilename}`)

        // Remove old image
        if( !!data.profileimage && data.profileimage !== 'model.png')
          fs.unlinkSync(`./upload/profile/${data.profileimage}`)

        data.profileimage = newprofilename
        await data.save()

        return res.status(200).send({
          success: true,
          status: 200,
          message: newprofilename,
        });
      }

      return res.status(400).send({
          success: false,
          status: 400,
          message: "invalid id",
        });

    } catch (error) {
      return res
        .status(500)
        .send({ status: 500, success: false, message: error.message });
    }
  }



  async getAllHeadCount(req, res) {
    try {
      const userExisted = await workforceService.Model.find({}).populate(
        "functionalarea"
      );

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

      req.body.percentage = parseFloat(
        (Object.keys(req.body).length / UserPropertyCount) * 100
      ).toFixed(2);
      if (req.body.percentage == 100) {
        req.body.status = "active";
      } else {
        req.body.status = "inactive";
      }

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
        E: "dateOfBirth",
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
      result.map(async (item, index) => {
        const data = await workforceService.Model.findOneAndUpdate(
          { _id: item._id },
          { employeeid: item._id.toString().slice(-5) },
          {
            new: true,
          }
        );
        if (index == result.length - 1) {
          await deleteFile(fileName, folder);
          res.status(200).send({
            status: 200,
            success: true,
            message: "User uploaded Successfully",
            result,
          });
        }
      });
    } catch (error) {
      console.log(error);
      await deleteFile(fileName, folder);
      res
        .status(500)
        .send({ status: 500, success: false, message: error.message });
    }
  }
  async addWorkForcepermission(req, res) {
    try {
      const { action } = req.body
      console.log('body: ', req.body, )
      if (action !== 'create') {
        return res
          .status(400)
          .send({ status: 400, success: false, message: 'Request failed' });
      }
      const uuid = createShortUuid()
      WorkforcePermission.find({ uuid: uuid })
        .then(data => {
          console.log("search result: ', ", data)
          if (data?.length !== 0) {
            return res
              .status(403)
              .send({ status: 403, success: false, message: 'Duplicated uuid exists' });
          }
          const newPermission = new WorkforcePermission({ uuid: uuid })
          newPermission.save()
            .then(data => {
              console.log('saved: ', data)
              return res
                .status(201)
                .send({ status: 201, success: true, message: data.uuid });
            })
        })

    } catch (err) {
      console.log('err: ', err)
      res
        .status(500)
        .send({ status: 500, success: false, message: err.message });
    }
  }

  async createNewWithPermission(req, res){
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        phone,
        workforcetype,
        functionalarea,
        gender,
        address,
        uuid,
      } = req.body;
      // UUID check 
      let workPermission = await WorkforcePermission.find({ uuid: uuid })

      if (workPermission.length === 0) {
        return res.send({
          success: false,
          status: 400,
          message: 'Link is not valid',
        });
      }

      if (
        !(
          firstName &&
          lastName &&
          email &&
          password &&
          dateOfBirth &&
          phone &&
          workforcetype &&
          functionalarea &&
          gender &&
          address
        )
      ) {
        return res.send({
          success: false,
          status: 200,
          message: "All input is required",
        });
      }
      const userExisted = await workforceService.Model.findOne({
        email: req.body.email,
      });

      if (userExisted)
        return res.send({
          success: false,
          status: 200,
          message: "user already existed",
        });
      req.body.percentage = parseFloat(
        (Object.keys(req.body).length / (UserPropertyCount+1)) * 100
      ).toFixed(2);
      if (req.body.percentage == 100) {
        req.body.status = "active";
      } else {
        req.body.status = "inactive";
      }

      const result = await workforceService.Model.create(req.body);

      const data = await workforceService.Model.findOneAndUpdate(
        { _id: result._id },
        { employeeid: result._id.toString().slice(-6) },
        {
          new: true,
        }
      );

      await WorkforcePermission.remove({ uuid: uuid })

      res.status(200).send({
        status: 200,
        success: true,
        message: "Created Successfully",
        data,
      });


    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ status: 500, success: false, message: error.message });
    }
  }
}

const usersController = new Users();
module.exports = usersController;
