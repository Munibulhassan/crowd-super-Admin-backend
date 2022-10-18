const departmentService = require("../../../service/department.service");
const _ = require("lodash")

class Departments {
  async create(req, res) {
    try {
      let { name } = req.body;
      const dataExisted = await departmentService.Model.findOne({ name });
      if (dataExisted)
        return res.send({
          success: true,
          status: 200,
          msg: "department already existed",
        });

      const data = await departmentService.Model.create(req.body);

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
      const data = await departmentService.Model.findById(id);
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
      let query = req.query;
      Object.keys(query).map((pro)=>{
        if(query[pro]) query[pro] = {$regex:query[pro],$options: "i" }
        else delete query[pro]
      })
      
      let data = await departmentService.Model.find(query);
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
      let data = await departmentService.Model.findById(id,{_id:0,name:1,code:1,description:1});
      if(req.body.code){
        req.body.code = req.body.code.toLowerCase();
        data._doc.code=data._doc.code.toLowerCase();
      }

      if(_.isEqual(data._doc,req.body)) return res.send({
        success: true,
        status: 200,
        msg: "record is already upto date",
      });
      
      if (!data)
        return res.send({
          success: true,
          status: 403,
          msg: "invalid id",
        });

      data = await departmentService.Model.findOneAndUpdate(
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

  async delete(req, res) {
    try {
      let { id } = req.params;
      let data = await departmentService.Model.findById(id,{_id:1});
      if (!data)
        return res.send({
          success: true,
          status: 403,
          msg: "invalid id",
        });
         data = await departmentService.Model.findByIdAndRemove(id);

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

const departmentsController = new Departments();
module.exports = departmentsController;
