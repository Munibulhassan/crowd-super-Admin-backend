const positionService = require("../../../service/position.service");
const _ = require("lodash")

class Positions {
  async create(req, res) {
    try {
      // let { name } = req.body;
      // const dataExisted = await positionService.Model.findOne({ name });
      // if (dataExisted)
      //   return res.send({
      //     success: true,
      //     status: 200,
      //     msg: "position already existed",
      //   });

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
      let data = await positionService.Model.findById(id,{_id:1});

      

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

  async delete(req, res) {
    try {
      let { id } = req.params;
      let data = await positionService.Model.findById(id,{_id:1});
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
