const express = require('express');
const historyController = require("./history.controller");

// const { authMiddleware } = require("../../../middleware/auth.middleware");
// const { roleMiddleware } = require("../../../middleware/role.middleware");
// const ValidationMiddleware = require("../../../middleware/validation.middleware");
// const validation = new ValidationMiddleware();

const historyRouter = express.Router();

// usersRouter.use(
//     authMiddleware.isAuthenticated(),
//     validation.validateUserByIdCheckDB(),
//     roleMiddleware.isAdmin()
// );


historyRouter.post("/create",
    historyController.create
);

historyRouter.get("/get/:id",
    historyController.get
);

historyRouter.get("/gets",
    historyController.gets
);

historyRouter.put("/update/:id",
    historyController.update
);

historyRouter.delete("/delete/:id",
    historyController.delete
);


module.exports = historyRouter;