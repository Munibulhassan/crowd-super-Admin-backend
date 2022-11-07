const express = require('express');
const { appMiddleware } = require('../../middleware/app.middleware');
const usersController = require("./user.controller");
const multer = require("multer")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        

        cb(null, './upload/user')
    },
    filename: function (req, file, cb) {
        

        
        cb(null, Date.now() + file.originalname)
    },
})
const upload = multer({storage: storage,limits:{fileSize:500 
}});
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

usersRouter.post("/login", 
    usersController.login
);
// usersRouter.post("/forgotpassword", 
//     usersController.forgotpassword
// );

usersRouter.post("/create",
    usersController.create
);

usersRouter.put("/update/:id",
    usersController.update
);


usersRouter.get("/search",
    usersController.search
);

usersRouter.get("/getAllHeadCount",
    usersController.getAllHeadCount
);


// usersRouter.get("/update",
//     usersController.update
// );

usersRouter.post("/image",upload.single("file"),usersController.imageupload)

usersRouter.post("/upload",
    appMiddleware.uploadXcelFile(),
    usersController.upload
);

module.exports = usersRouter;