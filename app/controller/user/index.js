const express = require('express');
const usersController = require("./user.controller");

// const { authMiddleware } = require("../../../middleware/auth.middleware");
// const { roleMiddleware } = require("../../../middleware/role.middleware");
// const ValidationMiddleware = require("../../../middleware/validation.middleware");
// const validation = new ValidationMiddleware();

const usersRouter = express.Router();

// usersRouter.use(
//     authMiddleware.isAuthenticated(),
//     validation.validateUserByIdCheckDB(),
//     roleMiddleware.isAdmin()
// );


usersRouter.post("/create",
    usersController.create
);

usersRouter.get("/getAllHeadCount",
    usersController.getAllHeadCount
);

module.exports = usersRouter;