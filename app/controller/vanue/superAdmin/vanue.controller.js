const vanuesService = require("../../../service/vanue.service");
const zoneService = require("../../../service/zone.service");

class Vanues {
  async create(req, res) {
    try {
      let { venuename, zone } = req.body;

      if (!(venuename && zone)) {
        return res.send({
          success: false,
          status: 200,
          message: "All input is required",
        });
      }
      const dataExisted = await vanuesService.Model.findOne({ venuename });    

      if (dataExisted)
        return res.send({
          success: true,
          status: 200,
          message: "department already existed",
        });

      const data = await vanuesService.Model.create({zone,venuename});

      const zone1 = await zoneService.Model.findById(zone);
      console.log(zone1, data);
      await zoneService.Model.updateOne(
        { _id: zone },
        { venuesunder: zone1.venuesunder + 1 }
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

  async get(req, res) {
    try {
      let { id } = req.params;
      const data = await vanuesService.Model.findById(id).populate("zone");
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
      let data = await vanuesService.Model.find().populate("zone");
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
      res
        .status(500)
        .send({ status: 500, success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      let { id } = req.params;
      let data = await vanuesService.Model.findById(id, { _id: 1, zone: 1 });

      if (!data)
        return res.send({
          success: true,
          status: 403,
          message: "invalid id",
        });

      if (req.body.zone) {
        const zone = await zoneService.Model.findById(req.body.zone);

        await zoneService.Model.updateOne(
          { _id: req.body.zone },
          { venuesunder: zone.venuesunder + 1 }
        );
        const zone1 = await zoneService.Model.findById(data.zone);

        if (zone1) {
          await zoneService.Model.updateOne(
            { _id: data.zone },
            { venuesunder: zone1.venuesunder - 1 }
          );
        }
      }
      data = await vanuesService.Model.findOneAndUpdate({ _id: id }, req.body, {
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

      let data = await vanuesService.Model.findById(id, { _id: 1, zone: 1 });
      if (!data)
        return res.send({
          success: true,
          status: 403,
          message: "invalid id",
        });
      const zone1 = await zoneService.Model.findById(data.zone);

      await zoneService.Model.updateOne(
        { _id: data.zone },
        { venuesunder: zone1.venuesunder - 1 }
      );

      data = await vanuesService.Model.findByIdAndRemove(id);

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

const vanuesController = new Vanues();
module.exports = vanuesController;
