const faService = require("../../../service/fa.service");
const departmentService = require("../../../service/department.service");

const _ = require("lodash");
const { conformsTo } = require("lodash");

class FA {
  async create(req, res) {
    try {
      let { functionalarea, department } = req.body;
      if (!(functionalarea && department)) {
        return res.send({
          success: false,
          status: 200,
          message: "All input is required",
        });
      }
      const dataExisted = await faService.Model.findOne({ functionalarea });
      if (dataExisted)
        return res.send({
          success: true,
          status: 200,
          message: "FA already existed",
        });

      const datacount = await faService.Model.find();

      req.body.facode = req.body.facode.toUpperCase();

      const data = await faService.Model.create(req.body);
      const department1 = await departmentService.Model.findById(
        req.body.department
      );
      await departmentService.Model.updateOne(
        { _id: req.body.department },
        { totalfunction: department1.totalfunction + 1 }
      );
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
      const data = await faService.Model.findById(id).populate("department");
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
      if (req.query) {
        let data = await faService.Model.find(req.query).populate("department");
        if (data.length == 0)
          return res.send({
            success: true,
            status: 200,
            message: "no data found",
            data: [],
          });

        res.status(200).send({
          status: 200,
          success: true,
          message: "Fetched Successfully",
          count: data.length,
          data,
        });
      } else {
        let data = await faService.Model.find();
        if (data.length == 0)
          return res.send({
            success: true,
            status: 200,
            message: "no data found",
            data: [],
          });

        res.status(200).send({
          status: 200,
          success: true,
          message: "Fetched Successfully",
          count: data.length,
          data,
        });
      }
    } catch (error) {
      res
        .status(500)
        .send({ status: 500, success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      let { id } = req.params;
      let data = await faService.Model.findById(id);

      if (req.body.facode) {
        req.body.facode = req.body.facode.toUpperCase();
      }

      if (_.isEqual(data._doc, req.body))
        return res.send({
          success: true,
          status: 200,
          message: "record is already upto date",
        });

      if (!data)
        return res.send({
          success: true,
          status: 403,
          message: "invalid id",
        });

      if (req.body.department) {
        const department = await departmentService.Model.findById(
          req.body.department
        );
        console.log(department);
        await departmentService.Model.updateOne(
          { _id: req.body.department },
          { totalfunction: department.totalfunction + 1 }
        );
        const department1 = await departmentService.Model.findById(
          data.department
        );

        await departmentService.Model.updateOne(
          { _id: data.department },
          { totalfunction: department1?.totalfunction - 1 }
        );
      }
      data = await faService.Model.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });

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

  async delete(req, res) {
    try {
      let { id } = req.params;
      let data = await faService.Model.findById(id, { _id: 1 });
      if (!data)
        return res.send({
          success: true,
          status: 403,
          message: "invalid id",
        });
      data = await faService.Model.findByIdAndRemove(id);

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

const fasController = new FA();
module.exports = fasController;
