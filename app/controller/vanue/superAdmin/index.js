const express = require("express");
const vanuesController = require("./vanue.controller");

// const { authMiddleware } = require("../../../middleware/auth.middleware");
// const { roleMiddleware } = require("../../../middleware/role.middleware");
// const ValidationMiddleware = require("../../../middleware/validation.middleware");
// const validation = new ValidationMiddleware();

const vanuesRouter = express.Router();

// usersRouter.use(
//     authMiddleware.isAuthenticated(),
//     validation.validateUserByIdCheckDB(),
//     roleMiddleware.isAdmin()
// );

vanuesRouter.post("/create", vanuesController.create);

vanuesRouter.get("/get/:id", vanuesController.get);

vanuesRouter.get("/gets", vanuesController.gets);

vanuesRouter.put("/update/:id", vanuesController.update);

vanuesRouter.delete("/delete/:id", vanuesController.delete);

module.exports = vanuesRouter;
