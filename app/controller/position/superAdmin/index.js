const express = require('express');
const { appMiddleware } = require('../../../middleware/app.middleware');
const positionsController = require("./position.controller");


// const { authMiddleware } = require("../../../middleware/auth.middleware");
// const { roleMiddleware } = require("../../../middleware/role.middleware");
// const ValidationMiddleware = require("../../../middleware/validation.middleware");
// const validation = new ValidationMiddleware();

const positionsRouter = express.Router();

// usersRouter.use(
//     authMiddleware.isAuthenticated(),
//     validation.validateUserByIdCheckDB(),
//     roleMiddleware.isAdmin()
// );


positionsRouter.post("/create",
    positionsController.create
);

positionsRouter.get("/get/:id",
    positionsController.get
);

positionsRouter.get("/gets",
    positionsController.gets
);

positionsRouter.put("/update/:id",
    positionsController.update
);

positionsRouter.post("/upload",
appMiddleware.uploadXcelFile(),

    positionsController.upload
);

positionsRouter.delete("/delete/:id", 
    positionsController.delete
);


module.exports = positionsRouter;