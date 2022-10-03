const express = require('express');
const departmentsController = require("./department.controller");

// const { authMiddleware } = require("../../../middleware/auth.middleware");
// const { roleMiddleware } = require("../../../middleware/role.middleware");
// const ValidationMiddleware = require("../../../middleware/validation.middleware");
// const validation = new ValidationMiddleware();

const departmentsRouter = express.Router();

// usersRouter.use(
//     authMiddleware.isAuthenticated(),
//     validation.validateUserByIdCheckDB(),
//     roleMiddleware.isAdmin()
// );


departmentsRouter.post("/create",
    departmentsController.create
);

departmentsRouter.get("/get/:id",
    departmentsController.get
);

departmentsRouter.get("/gets",
    departmentsController.gets
);

departmentsRouter.put("/update/:id",
    departmentsController.update
);

departmentsRouter.delete("/delete/:id",
    departmentsController.delete
);


module.exports = departmentsRouter;