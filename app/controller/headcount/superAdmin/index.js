const express = require('express');
const headcountController = require("./headcount.controller");

// const { authMiddleware } = require("../../../middleware/auth.middleware");
// const { roleMiddleware } = require("../../../middleware/role.middleware");
// const ValidationMiddleware = require("../../../middleware/validation.middleware");
// const validation = new ValidationMiddleware();

const headcountRouter = express.Router();

// usersRouter.use(
//     authMiddleware.isAuthenticated(),
//     validation.validateUserByIdCheckDB(),
//     roleMiddleware.isAdmin()
// );


headcountRouter.post("/create",
    headcountController.create
);

headcountRouter.get("/get/:id",
    headcountController.get
);

headcountRouter.get("/gets",
    headcountController.gets
);

headcountRouter.put("/update/:id",
    headcountController.update
);

headcountRouter.delete("/delete/:id",
    headcountController.delete
);


module.exports = headcountRouter;