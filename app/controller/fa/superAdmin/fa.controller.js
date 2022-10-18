const faService = require("../../../service/fa.service");
const _ = require("lodash")

class FA {
  async create(req, res) {
    try {
      let { functionalarea } = req.body;
      const dataExisted = await faService.Model.findOne({ functionalarea });
      if (dataExisted)
        return res.send({
          success: true,
          status: 200,
          msg: "FA already existed",
        });
      const datacount = await faService.Model.find();
      
    
      req.body.facode = req.body.facode.toUpperCase()

      req.body.rolecode = (req.body.facode + req.body.jobtype + (datacount.length+1)).toUpperCase()



      const data = await faService.Model.create(req.body);

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
      const data = await faService.Model.findById(id);
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
      if(req.query){
        let data = await faService.Model.find(req.query);
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
      }else{
      let data = await faService.Model.find();
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
      });}
    } catch (error) {
      res.status(500).send({ status: 500, success: false, msg: error.message });
    }
  }

  async update(req, res) {
    try {
      let { id } = req.params;
      let data = await faService.Model.findById(id);
      const datacount = await faService.Model.find();
      if (req.body.facode || req.body.jobtype) {

        req.body.facode = req.body.facode.toUpperCase();
        req.body.rolecode = (req.body.facode + req.body.jobtype + datacount.length).toUpperCase()
      } else if (req.body.facode) {
        req.body.facode = req.body.facode.toUpperCase();
        req.body.rolecode = (req.body.facode + data.jobtype + datacount.length).toUpperCase()
      }

      // if(req.body.rolecode){
      //   req.body.facode= req.body.facode.toUpperCase()


      // }

      if (_.isEqual(data._doc, req.body)) return res.send({
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

      data = await faService.Model.findOneAndUpdate(
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
      let data = await faService.Model.findById(id, { _id: 1 });
      if (!data)
        return res.send({
          success: true,
          status: 403,
          msg: "invalid id",
        });
      data = await faService.Model.findByIdAndRemove(id);

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

const fasController = new FA();
module.exports = fasController;
