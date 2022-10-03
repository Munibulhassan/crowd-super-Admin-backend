const express = require('express');
const fasController = require("./fa.controller");

// const { authMiddleware } = require("../../../middleware/auth.middleware");
// const { roleMiddleware } = require("../../../middleware/role.middleware");
// const ValidationMiddleware = require("../../../middleware/validation.middleware");
// const validation = new ValidationMiddleware();

const fasRouter = express.Router();

// usersRouter.use(
//     authMiddleware.isAuthenticated(),
//     validation.validateUserByIdCheckDB(),
//     roleMiddleware.isAdmin()
// );


fasRouter.post("/create",
    fasController.create
);

fasRouter.get("/get/:id",
    fasController.get
);

fasRouter.get("/gets",
    fasController.gets
);

fasRouter.put("/update/:id",
    fasController.update
);

fasRouter.delete("/delete/:id",
    fasController.delete
);


module.exports = fasRouter;