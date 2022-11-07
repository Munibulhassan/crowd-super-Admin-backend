const rolesService = require("../../../service/role.service");

class Roles {

    async create(req, res) {
        try {
          let { name } = req.body;
          const dataExisted = await rolesService.Model.findOne({ name });
          if (dataExisted)
            return res.send({
              success: true,
              status: 200,
              message: "role already existed",
            });
    
          const data = await rolesService.Model.create(req.body);
    
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
          const data = await rolesService.Model.findById(id);
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
          let data = await rolesService.Model.find();
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
          let data = await rolesService.Model.findById(id,{_id:1});
          
          if (!data)
            return res.send({
              success: true,
              status: 403,
              message: "invalid id",
            });
    
          data = await rolesService.Model.findOneAndUpdate(
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
          let data = await rolesService.Model.findById(id,{_id:1});
          if (!data)
            return res.send({
              success: true,
              status: 403,
              message: "invalid id",
            });
             data = await rolesService.Model.findByIdAndRemove(id);
    
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

const rolesController = new Roles();
module.exports = rolesController;