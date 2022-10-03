const usersService = require("../../service/user.service");

class Users {

    async create(req, res) {
        try {
            
            const userExisted = await usersService.Model.findOne({email:req.body.email});
           
            if (userExisted) return res.send({ success: true, status: 200, msg: "user already existed" })

            const result = await usersService.Model.create(req.body)

            res.status(200).send({
                status: 200,
                success: true,
                msg: "Created Successfully",
                data: result,
            });
        } catch (error) {
            res.status(500).send({status:500 ,success: false, msg: error.message });
        }
    };

    async getAllHeadCount(req, res) {
        try {
            
            const userExisted = await usersService.getAllHeadCount();

            if(userExisted.length==0)return res.status(200).send({
                status: 200,
                success: true,
                msg: "No data found",
                data: [],
            });

            res.status(200).send({
                status: 200,
                success: true,
                msg: "Fetched Successfully",
                data: userExisted,
            });
        } catch (error) {
            res.status(500).send({status:500 ,success: false, msg: error.message });
        }
    };


}

const usersController = new Users();
module.exports = usersController;