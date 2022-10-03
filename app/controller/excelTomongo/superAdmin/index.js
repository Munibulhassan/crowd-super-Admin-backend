const express = require("express");
const excelToMongoController = require("./excelToMongo.controller");
const {appMiddleware} = require("../../../middleware/app.middleware")

const excelToMongoRouter = express.Router();

// usersRouter.use(
//     authMiddleware.isAuthenticated(),
//     validation.validateUserByIdCheckDB(),
//     roleMiddleware.isAdmin()
// );

excelToMongoRouter.post(
  "/create",
  appMiddleware.uploadXcelFile(),
  excelToMongoController.create
);

module.exports = excelToMongoRouter;
