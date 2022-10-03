const express = require('express');
const zoneController = require("./zone.controller");

// const { authMiddleware } = require("../../../middleware/auth.middleware");
// const { roleMiddleware } = require("../../../middleware/role.middleware");
// const ValidationMiddleware = require("../../../middleware/validation.middleware");
// const validation = new ValidationMiddleware();

const zoneRouter = express.Router();

// usersRouter.use(
//     authMiddleware.isAuthenticated(),
//     validation.validateUserByIdCheckDB(),
//     roleMiddleware.isAdmin()
// );


zoneRouter.post("/create",
    zoneController.create
);

zoneRouter.get("/get/:id",
    zoneController.get
);

zoneRouter.get("/gets",
    zoneController.gets
);

zoneRouter.put("/update/:id",
    zoneController.update
);

zoneRouter.delete("/delete/:id",
    zoneController.delete
);


module.exports = zoneRouter;