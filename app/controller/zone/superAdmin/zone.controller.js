const zoneService = require("../../../service/zone.service");
const _ = require("lodash");
const vanuesService = require("../../../service/vanue.service");

class Zone {
  async create(req, res) {
    try {
      // let { name } = req.body;
      // const dataExisted = await zoneService.Model.findOne({ name });
      // if (dataExisted)
      //   return res.send({
      //     success: true,
      //     status: 200,
      //     message: "FA already existed",
      //   });

      const data = await zoneService.Model.create(req.body);

      res.status(200).send({
        status: 200,
        success: true,
        message: "Created Successfully",
        data,
      });
    } catch (error) {
      res.status(500).send({ status: 500, success: false, message: error.message });
    }
  }

  async get(req, res) {
    try {
      let { id } = req.params;
      const data = await zoneService.Model.findById(id);
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
      res.status(500).send({ status: 500, success: false, message: error.message });
    }
  }

  async gets(req, res) {
    try {
      let data = await zoneService.Model.find();
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
    } catch (error) {
      res.status(500).send({ status: 500, success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      let { id } = req.params;
      let data = await zoneService.Model.findById(id, {
        _id: 0,
        name: 1,
        code: 1,
        description: 1,
      });
      if (req.body.code) {
        req.body.code = req.body.code.toLowerCase();
        data._doc.code = data._doc.code.toLowerCase();
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

      data = await zoneService.Model.findOneAndUpdate({ _id: id }, req.body, {
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

  async delete(req, res) {
    try {
      let { id } = req.params;
      let data = await zoneService.Model.findById(id, { _id: 1 });
      if (!data)
        return res.send({
          success: true,
          status: 403,
          message: "invalid id",
        });
      data = await zoneService.Model.findByIdAndRemove(id);

      res.status(200).send({
        status: 200,
        success: true,
        message: "Deleted Successfully",
        data,
      });
    } catch (error) {
      res.status(500).send({ status: 500, success: false, message: error.message });
    }
  }
}

const zoneController = new Zone();
module.exports = zoneController;
