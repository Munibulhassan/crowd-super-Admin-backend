const headcountService = require("../../../service/headcount.service");
const _ = require("lodash");

class HeadCount {
  async create(req, res) {
    try {
      
      let {
        event,
        functionalarea,
        startdate,
        totaldays,
        shifttime,
        headcount,
        peakshift,
        peakshiftheadcount,
      } = req.body;
      if (
        !(
          functionalarea &&
          startdate &&
          totaldays &&
          shifttime &&
          headcount &&
          peakshift &&
          peakshiftheadcount
        )
      ) {
        return res.status(200).send({
          success: false,
          message: "Input is missing",
        });
      }

      const data = await headcountService.Model.create(req.body);

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
      const data = await headcountService.Model.findById(id);
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
      if (req.query) {
        let data = await headcountService.Model.find(req.query);
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
        let data = await headcountService.Model.find();
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
      res.status(500).send({ status: 500, success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      let { id } = req.params;
      let data = await headcountService.Model.findById(id);
      const datacount = await headcountService.Model.find();
      if (req.body.facode || req.body.jobtype) {
        req.body.facode = req.body.facode.toUpperCase();
        req.body.rolecode = (
          req.body.facode +
          req.body.jobtype +
          datacount.length
        ).toUpperCase();
      } else if (req.body.facode) {
        req.body.facode = req.body.facode.toUpperCase();
        req.body.rolecode = (
          req.body.facode +
          data.jobtype +
          datacount.length
        ).toUpperCase();
      }

      // if(req.body.rolecode){
      //   req.body.facode= req.body.facode.toUpperCase()

      // }

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

      data = await headcountService.Model.findOneAndUpdate(
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
      res.status(500).send({ status: 500, success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      let { id } = req.params;
      let data = await headcountService.Model.findById(id, { _id: 1 });
      if (!data)
        return res.send({
          success: true,
          status: 403,
          message: "invalid id",
        });
      data = await headcountService.Model.findByIdAndRemove(id);

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

const headcountController = new HeadCount();
module.exports = headcountController;
