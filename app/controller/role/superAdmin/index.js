const express = require("express");
const rolesController = require("./role.controller");

// const { authMiddleware } = require("../../../middleware/auth.middleware");
// const { roleMiddleware } = require("../../../middleware/role.middleware");
// const ValidationMiddleware = require("../../../middleware/validation.middleware");
// const validation = new ValidationMiddleware();

const rolesRouter = express.Router();

// usersRouter.use(
//     authMiddleware.isAuthenticated(),
//     validation.validateUserByIdCheckDB(),
//     roleMiddleware.isAdmin()
// );

rolesRouter.post("/create", rolesController.create);

rolesRouter.get("/get/:id", rolesController.get);

rolesRouter.get("/gets", rolesController.gets);

rolesRouter.put("/update/:id", rolesController.update);

rolesRouter.delete("/delete/:id", rolesController.delete);

module.exports = rolesRouter;
