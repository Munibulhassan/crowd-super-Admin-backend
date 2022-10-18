const compose = require("composable-middleware");
const { ValidationJoi } = require("../../utils/validationJoi");
const Service = require("../service")
const bcrypt = require("bcrypt");
const moment = require("moment");
const validateJoi = new ValidationJoi();
const ObjectId = require('mongoose').Types.ObjectId;


module.exports = class ValidationMiddleware {
    constructor() { }
    //***************************************************** USER SECTION START ****************************************************************** */
    //********************** User Register Validate Joi************************************* */
    validateUserRegistration() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateUserRegisterJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            res.status(400).send(errors);
                            return;
                        });
                }).use((req, res, next) => {
                    if (req.body.password == req.body.confirmPassword) {
                        next();
                    } else {
                        res.status(400).send({ success: false, status: 400, msg: "Both Password Must Be Same" })
                    }
                })
                .use(this.validateUserEmailCheckDB())
                .use(this.validateUserNameCheckDB())

        )
    }

    //********************** User Update Validate Joi************************************* */
    validateUserUpdateJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateUserUpdateJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            res.status(400).send(errors);
                            return;
                        });
                })
        )
    }

    //********************** Manually Subscribe Validate Joi************************************* */
    validateManuallySubscribeJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateManuallySubscribeJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            res.status(400).send(errors);
                            return;
                        });
                })
        )
            .use(this.validateUserByEmailDB())
            .use(this.validatePackageByIdDB())
            .use(this.validateUserStripeId())
    }

    //********************** User Login Validate Joi************************************* */
    validateUserLogin() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateUserLoginJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
        )
            .use(this.validateUserByEmailDB())
            .use(async (req, res, next) => {
                const type = req.body.type
                if (type == "admin") {
                    if (req.user && req.user.role && req.user.role && req.user.role.name == "ADMIN") next()
                    else return res.status(400).send({ success: false, status: 400, msg: "Access Forbiden" });
                } else {
                    next()
                }
            })
            .use(async (req, res, next) => {
                const passwordChecked = await bcrypt.compare(req.body.password, req.user.password)
                if (passwordChecked) next()
                else return res.status(400).send({ success: false, status: 400, msg: "Password Is Invalid" });
            })
    }

    //********************** User Login Validate Joi************************************* */
    validateUserEmail() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateEmailJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
        )
            .use(this.validateUserByEmailDB())
    }

    //********************** User UPDATE Joi************************************* */
    validateUpdateUserJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateUpdateUserJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
        )
            // .use(this.validateImageById())
            .use(this.validateCheckUserHasImage())

    }

    //********************** User UPDATE Joi************************************* */
    validateUserFeatureUserJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateUserFeatureUpdateJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
        )
    }

    //********************** User Login Validate Joi************************************* */
    validateUserResetPassowrd() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateResetPasswordJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
        )
            .use(async (req, res, next) => {
                try {
                    let token = await Service.resetTokenService.findOne({ token: req.body.resetToken })

                    if (token) {
                        req.token = token;
                        next();
                    }
                } catch (error) {
                    res.status(400).send({ success: false, msg: error.msg });
                }
            })
            .use(async (req, res, next) => {
                try {

                    

                    if (moment(req.token.expireTime, "MMMM Do YYYY, h:mm:ss a").isAfter(moment(new Date(), "MMMM Do YYYY, h:mm:ss a"))) next()
                    else {
                        Service.resetTokenService.findOneAndRemove({ token: req.body.resetToken })
                        return res.status(400).send({ success: false, status: 400, msg: "Bad Request or linked was Expired" });
                    }
                } catch (error) {
                    res.status(400).send({ success: false, msg: error.msg });
                }
            })
            .use(async (req, res, next) => {
                
                if (req.body.newPassword == req.body.confirmPassword) {
                    next();
                } else {
                    return res.status(400).send({ success: false, status: 400, msg: "Both Password Must Be Same" })
                }
            })
    }

    //********************** User Change Password************************************* */
    validateUserChangePassword() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateChangePasswordJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
                .use(async (req, res, next) => {
                    const userPass = await Service.userService.findPassword(req.user._id);
                    const passwordChecked = await bcrypt.compare(req.body.oldPassword, userPass.password)
                    if (passwordChecked) {
                        req.userPass = userPass
                        next()
                    }
                    else return res.status(400).send({ success: false, status: 400, msg: "Old password is invalid " });
                })
                .use(async (req, res, next) => {
                    const passwordChecked = await bcrypt.compare(req.body.newPassword, req.userPass.password)
                    if (passwordChecked) return res.status(400).send({ success: false, status: 400, msg: "Please give new Password" });
                    else next()
                })
                .use((req, res, next) => {
                    if (req.body.newPassword == req.body.confirmPassword) {
                        next();
                    } else {
                        res.status(400).send({ success: false, status: 400, msg: "Both Password Must Be Same" })
                    }
                })

        )
    }

    //********************** ************************************* */
    validateCreateCommentJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateCreateCommentJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(200).send(errors);
                        });
                })
        )
    }

    //********************** BookMark Create Validate joi ************************************* */
    validateCreateBookMarkJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateCreateBookMarkJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(200).send(errors);
                        });
                })
        )
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //***************************************************** BOOK SECTION ********************************************************************** */
    //********************** BOOK Validate Joi ************************************* */
    validateBookCreate() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateBookJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
                .use(this.validateImageById())
                .use(this.validateCategoryByIdForBookDB())
                .use(this.validateBookByFolderIdDB())
                .use(this.validateGoogleFolderByID())
                .use(this.validateBookByNameDB())
        )
    }

    //********************** UPDATE BOOK Validate Joi ************************************* */
    validateUpdateBookJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateUpdateBookJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
                .use(this.validateImageById())
                .use(this.validateCategoryByIdForUpdateBookDB())
                // .use(this.validateSeasonByNameDB())
                .use(this.validateUpdateBookByFolderIdDB())
                .use(this.validateGoogleFolderByIDForUpdatBook())
                .use(this.validateUpdateBookByNameDB())
                .use(this.validateCheckBookHasImageDB())
        )
    }

    //********************** Pulish Book Validate Joi ************************************* */
    validateBookChapterCreateJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validatePublishBookJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
                .use(this.validateBookByIdDB())
                .use(this.validateSeasonByIdForChapter())
        )
    }

    //********************** Update Single Chapter Validate Joi ************************************* */
    validateUpdateSingleChapterJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateUpdateSingleChapterJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
                .use(this.validateGoogleDocByIDCreate())
                .use(this.validateSeasonByFileIdDBCreate())
        )
    }

    //********************** Create Book Single Chapter ************************************* */
    validatePublishBookJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validatePublishBookJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
                .use(this.validateGoogleDocByIDCreate())
                .use(this.validateSeasonByFileIdDBCreate())
        )
    }

    //********************** Publish Season Bulk ************************************* */
    validatePublishSeasonBulkJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validatePublishSeasonBulkJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
            // .use(this.validateSeasonByFileIdDBCreate())
        )
    }

    //********************** Pulish Season Validate Joi ************************************* */
    validatePublishSeasonJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validatePublishSeasonJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
        )
    }

    //********************** Create Season Validate Joi ************************************* */
    validateCreateSeasonJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateCreateSeasonJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
                .use(this.validateSeasonByAllDB())
                .use(this.validateSeasonByIdDB())
                .use(this.validateGoogleDocByID())
        )
    }

    //********************** update Season Validate Joi ************************************* */
    validateUpdateSeasonJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateUpdateSeasonJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
                .use(this.validateSeasonByParamsIdDB())
            // .use(this.validateSeasonByIdDB())
            // .use(this.validateGoogleDocByID())
            // .use(this.validateCategoryByNameDB())
        )
    }

    //********************** Create Chapter Validate Joi ************************************* */
    validateCreateChapterJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateCreateChapterJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
                .use(this.validateChapterByNameDB())
        )
    }

    //********************** Create Para Validate Joi ************************************* */
    validateCreateParaJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateCreateParaJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
        )
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //***************************************************** ROLE SECTION ********************************************************************** */
    //********************** ROLE Validate Joi ************************************* */
    validateRoleCreate() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateRoleJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                }).use(this.validateCategoryByNameDB())
        )
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //***************************************************** CATEGORIES SECTION ********************************************************************** */
    //********************** ROLE Validate Joi ************************************* */
    validateCategoryCreate() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateCategoryJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                }).use(this.validateCategoryByNameDB())
        )
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //***************************************************** PACKAGE SECTION ********************************************************************** */
    //********************** Package Validate Joi ************************************* */
    validatePackageJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validatePackageJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
                .use(this.validatePackageByNameDB())
        )
    }

    //********************** DATABASE PACKAGE validate By Id ************************************* */
    validatePackageByIdDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data;
                    let id = req.params.id || req.body.product || req.body.package
                    const checkId = ObjectId.isValid(id);
                    if (!checkId) id = undefined
                    data = await Service.packageService.findById(id);

                    if (!data) {
                        var errors = {
                            success: true,
                            status: 400,
                            msg: "Package Is Not Found With Given Id"
                        };
                        return res.status(400).send(errors);
                    }
                    else {
                        req.package = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE stripe subscription check ************************************* */
    validateStripeSubscription() {
        return (
            compose().use(async (req, res, next) => {
                try {

                    const data = await Service.stripeService.findSubscriptions({ customer: req.user.customerId });
                    return console.log(data)

                    if (!data) {
                        var errors = {
                            success: true,
                            status: 400,
                            msg: "Package Is Not Found With Given Id"
                        };
                        return res.status(400).send(errors);
                    }
                    else {
                        req.package = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE PACKAGE validate By Id ************************************* */
    validatePackageSelect() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data;
                    let id = req.params.id || req.body.product
                    const checkId = ObjectId.isValid(id);
                    if (!checkId) id = undefined
                    data = await Service.packageService.findById(id);

                    if (!data) {
                        var errors = {
                            success: true,
                            status: 400,
                            msg: "Package Is Not Found With Given Id"
                        };
                        return res.status(400).send(errors);
                    }
                    else {
                        req.package = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE PACKAGE validate By Id ************************************* */
    validateAttachedPackage() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data;
                    let id = req.params.id || req.body.product
                    const checkId = ObjectId.isValid(id);
                    if (!checkId) id = undefined
                    data = await Service.packageService.findById(id);

                    if (!data) {
                        var errors = {
                            success: true,
                            status: 400,
                            msg: "Package Is Not Found With Given Id"
                        };
                        return res.status(400).send(errors);
                    }
                    else {
                        req.package = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //***************************************************** ORDER SECTION ********************************************************************** */
    //********************** ORDERS Validate Joi************************************* */
    validateOrders() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateOrderJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
        )
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //***************************************************** STRIPE SECTION ********************************************************************** */
    //********************** ORDERS Validate Joi************************************* */
    validateSubscriptionJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateSubscriptionJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
        )
    }

    //********************** Subcriptions pre Validate Joi************************************* */
    validateSubscription1Joi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateSubscription1Joi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
                .use(async (req, res, next) => {
                    const userPackage = await Service.orderService.findOne({ subscription: req.user.subscription, active: true, user: req.user._id })
                    if (!userPackage) {
                        next()
                    } else {
                        var errors = {
                            success: false,
                            msg: "Subscription is already active"
                        };
                        return res.status(400).send(errors);
                    }
                })
        )
    }

    //********************** Subcriptions Custom Validate Joi************************************* */
    validateCustomSubscriptionJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateCustomSubscriptionJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
                .use(async (req, res, next) => {
                    const userPackage = await Service.orderService.findOne({ subscription: req.user && req.user.subscription, active: true, user: req.user._id })
                    if (!userPackage) {
                        next()
                    } else {
                        var errors = {
                            success: false,
                            msg: "Subscription is already active"
                        };
                        return res.status(400).send(errors);
                    }
                })
                .use(async (req, res, next) => {
                    if (req.body.amount <= 9) {
                        var errors = {
                            success: false,
                            msg: "Please Select amount greater then 9"
                        };
                        return res.status(400).send(errors);

                    } else if (req.body.amount == 15 || req.body.amount == 9) {
                        var errors = {
                            success: false,
                            msg: "Connot Select Package value"
                        };
                        return res.status(400).send(errors);
                    } else {
                        const packages = await Service.packageService.find({
                            amount:
                                { $lte: req.body.amount },
                        }, { sort: { amount: -1 }, limit: 1 }
                        )
                        if (packages.length > 0)
                            req.package = packages[0]

                        next()
                    }
                })
        )
    }

    //********************** Subcriptions update Custom Validate Joi************************************* */
    validateUpdateCustomSubscriptionJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateCustomSubscriptionJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
                .use(async (req, res, next) => {
                    if (req.body.amount <= 9) {
                        var errors = {
                            success: false,
                            msg: "Please Select amount greater then 9"
                        };
                        return res.status(400).send(errors);

                    } else if (req.body.amount == 15) {
                        var errors = {
                            success: false,
                            msg: "Connot Select Package value"
                        };
                        return res.status(400).send(errors);
                    } else {
                        const packages = await Service.packageService.find({
                            amount:
                                { $lte: req.body.amount },
                        }, { sort: { amount: -1 }, limit: 1 }
                        )
                        if (packages.length > 0)
                            req.package = packages[0]

                        next()
                    }
                })
        )
    }

    //********************** ORDERS Validate Joi************************************* */
    validateCreateFavoriteBookJoi() {
        return (
            compose()
                .use((req, res, next) => {
                    validateJoi.validateCreateFavoriteBookJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            return res.status(400).send(errors);
                        });
                })
                .use(this.validateCheckLikeBook())
        )
    }

    //======================================================= DATABASE VALIDATION ==============================================================================================================
    //======================================================= DATABASE VALIDATION ==============================================================================================================

    //***************************************************** USER SECTION START ****************************************************************** */
    //********************** DATABASE User Email All Ready Exist Checked ************************************* */
    validateUserEmailCheckDB() {
        return (
            compose().use(async (req, res, next) => {
                let findOne = await Service.userService.findOne({ email: req.body.email });
                if (findOne) {
                    var errors = {
                        success: false,
                        msg: "This Email Is Already Registered"
                    };
                    return res.status(400).send(errors);
                } else {
                    next();
                }
            })
        )
    }

    //********************** DATABASE User Username AllReady Exist Checked ************************************* */
    validateUserNameCheckDB() {
        return (
            compose().use(async (req, res, next) => {
                let findOne = await Service.userService.findOne({ username: req.body.username });
                if (findOne) {
                    var errors = {
                        status: 400,
                        success: false,
                        msg: "This username Is Already Registered"
                    };
                    return res.status(400).send(errors);
                } else {
                    next();
                }
            })
        )
    }

    //********************** DATABASE User Validate By Id Exist Checked ************************************* */
    validateUserByIdCheckDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data = await Service.userService.findById(req.user._id);
                    if (!data) {
                        var errors = {
                            status: 200,
                            success: false,
                            msg: "access denied no or invalid token"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.user = data
                        next();
                    }
                } catch (error) {
                    res.status(400).send({ success: false, status: 400, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE User Validate By Param Checked ************************************* */
    validateUserByParamCheckDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data = await Service.userService.findById(req.params.id);
                    if (!data) {
                        var errors = {
                            success: false,
                            msg: "No Data Was Found Or User Is Not Valid"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.client = data
                        next();
                    }
                } catch (error) {
                    res.status(400).send({ success: false, status: 400, msg: "No Data Was Found Or User Is Not Valid" });
                }
            })
        )
    }

    //********************** DATABASE User Email Varefication ************************************* */
    validateUserByEmailDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    const email = req.body.email
                    let data = await Service.userService.findOne({ email });
                    if (!data) {
                        var errors = {
                            success: false,
                            msg: "This Email Was Not Register"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.user = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE User Login Varefication ************************************* */
    validateLoginDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data = await Service.userService.findOne({ email: req.body.email, password: req.body.password });
                    if (!data) {
                        var errors = {
                            success: false,
                            msg: "Invalid Password Or Email"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.user = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //***************************************************** BOOK SECTION ****************************************************************** */
    //********************** DATABASE Book validate By Id ************************************* */
    validateBookByIdDB() {
        return (
            compose().use(async (req, res, next) => {
                try {

                    const id = req.params.id || req.body.book
                    const checkId = ObjectId.isValid(id);
                    if (!checkId) id = undefined
                    const data = await Service.bookService.findById(id);

                    if (!data) {
                        var errors = {
                            success: false,
                            status: 400,
                            msg: "Book Is Not Found With Given Id"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.book = data

                        next();
                    }
                } catch (error) {
                    res.status(500).send({ status: 2000, success: false, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE Season Check validate By Id ************************************* */
    validateSeasonCheckByIdDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    const data = await Service.seasonService.findById(req.params.id);
                    if (!data) {
                        var errors = {
                            success: false,
                            status: 400,
                            msg: "Season Is Not Found With Given Id"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.season = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE Chapter Check already existed By chapter Name ************************************* */
    validateChapterCheckAlreadyExisted() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    const chapterHeading = req.body.chapter.split("-")[0] && req.body.chapter.split("-")[0].trim();
                    const chapterTitle = req.body.chapter.split("-")[1] && req.body.chapter.split("-")[1].trim()
                    const chapter = await Service.chapterService.findOne({ name: chapterHeading, title: chapterTitle, season: req.season._id, book: req.book._id });

                    if (chapter) {
                        var errors = {
                            success: false,
                            status: 200,
                            msg: "Chapter is already existed"
                        };
                        return res.status(200).send(errors);
                    } else {
                        req.body.heading = chapterHeading;
                        req.body.title = chapterTitle;
                        next()
                    }

                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE Chapter Check already existed By chapter Name ************************************* */
    validateChapterByNameRefWithBook() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    const chapterHeading = req.body.chapter.split("-")[0] && req.body.chapter.split("-")[0].trim();
                    const chapterTitle = req.body.chapter.split("-")[1] && req.body.chapter.split("-")[1].trim()
                    const chapter = await Service.chapterService.findOne({ name: chapterHeading, title: chapterTitle, season: req.season._id, book: req.book._id });
                    if (!chapter) {
                        var errors = {
                            success: false,
                            status: 200,
                            msg: "invalid chapter"
                        };
                        return res.status(200).send(errors);
                    } else {
                        req.body.heading = chapterHeading;
                        req.body.title = chapterTitle;
                        req.updateChapter = chapter
                        next()
                    }

                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    // //********************** third Party api Check Chapter existed in google docs ************************************* */
    // validateChapterCheckAlreadyExisted() {
    //     return (
    //         compose().use(async (req, res, next) => {
    //             try {
    //                 const result = await Service.googleDriveService.downloadJSONReturn(req.googleDoc.id)
    //                 console.log(result)

    //             } catch (error) {
    //                 res.status(500).send({ success: false, msg: error.message });
    //             }
    //         })
    //     )
    // }

    //********************** DATABASE BOOK validate By name ************************************* */
    validateBookByNameDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data = await Service.bookService.findOne({ Title: req.body.Title });
                    if (data) {
                        var errors = {
                            success: true,
                            status: 400,
                            msg: "Book Title Is Already Existed"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.Book = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE update BOOK validate By name ************************************* */
    validateUpdateBookByNameDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    if (req.body.Title) {
                        let data = await Service.bookService.findOne({ Title: req.body.Title });
                        if (data) {
                            var errors = {
                                success: true,
                                status: 400,
                                msg: "Book Title Is Already Existed"
                            };
                            return res.status(400).send(errors);
                        } else {
                            req.Book = data
                            next();
                        }
                    } else {
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** check book has image ************************************* */
    validateCheckBookHasImageDB() {
        return (
            compose().use(async (req, res, next) => {
                try {

                    let data = await Service.coverService.findById(req.book.Cover);
                    req.cover = data
                    next();

                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE Season Check validate By name ************************************* */
    validateSeasonByNameDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data = await Service.seasonService.findOne({ name: req.body.name, book: req.body.book });
                    if (data) {
                        var errors = {
                            success: true,
                            status: 400,
                            msg: "Season name is already existed"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.season = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE Season Check validate By name And Book And Season************************************* */
    validateSeasonByAllDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data = await Service.seasonService.findOne({ name: req.body.name, book: req.body.book, season: req.body.season });
                    if (data) {
                        var errors = {
                            success: true,
                            status: 400,
                            msg: "season is already existed"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.season = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE Season Check validate By Params Id************************************* */
    validateSeasonByParamsIdDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data = await Service.seasonService.findOne({ _id: req.params.id });
                    if (!data) {
                        var errors = {
                            success: true,
                            status: 400,
                            msg: "invalid id"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.season = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE Season Check validate By Google File Id ************************************* */
    validateSeasonByFileIdDBCreate() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let season = await Service.seasonService.findOne({ season: req.body.season, book: req.body.book });
                    if (!season) {
                        var errors = {
                            success: false,
                            status: 200,
                            msg: "Season id is invalid"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.season = season
                        next()
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }


    //********************** DATABASE Chapter Check validate By name ************************************* */
    validateChapterByNameDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data = await Service.chapterService.findOne({ name: req.body.name });

                    if (data) {
                        var errors = {
                            success: true,
                            status: 400,
                            msg: "Chapter name is already existed"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.chapter = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** create book Folder Id validate By name ************************************* */
    validateBookByFolderIdDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data = await Service.bookService.findOne({ FolderID: req.body.FolderID });
                    if (data) {
                        var errors = {
                            success: true,
                            status: 400,
                            msg: "This Folder Id Is Already In Used"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.Book = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** update book DATABASE FolderId validate ************************************* */
    validateUpdateBookByFolderIdDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    if (req.body.FolderID) {
                        let data = await Service.bookService.findOne({ FolderID: req.body.FolderID });
                        if (data) {
                            var errors = {
                                success: true,
                                status: 400,
                                msg: "This Folder Id Is Already In Used"
                            };
                            return res.status(400).send(errors);
                        } else {
                            req.Book = data
                            next();
                        }
                    } else {
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE Season validate By Id ************************************* */
    validateSeasonByIdDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data = await Service.seasonService.findOne({ season: req.body.season });

                    if (data) {
                        var errors = {
                            success: true,
                            status: 400,
                            msg: "This Season id is already in used"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.season = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //***************************************************** ORDER SECTION ****************************************************************** */
    //********************** DATABASE Order validate By User ************************************* */
    validateOrderByUser() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data = await Service.orderService.find({ user: req.user._id });
                    if (data.lenght == 0 | data.lenght == undefined) {
                        var errors = {
                            success: true,
                            status: 200,
                            msg: "Nothing Is Found"
                        };
                        return res.status(200).send(errors);
                    } else {
                        req.order = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //***************************************************** ROLE SECTION ****************************************************************** */
    //********************** DATABASE ROLE validate By User ************************************* */
    validateRoleByNameDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data = await Service.roleService.findOne({ name: req.body.name });
                    if (data) {
                        var errors = {
                            success: true,
                            status: 400,
                            msg: "Given Value Is Already Existed"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.role = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE ROLE validate By Id ************************************* */
    validateRoleByIdDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data = await Service.roleService.findById(req.params.id);
                    if (!data) {
                        var errors = {
                            success: true,
                            status: 400,
                            msg: "Nothing Is Found With Given Id"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.role = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //***************************************************** CATEGORY SECTION ****************************************************************** */
    //********************** DATABASE CATEGORY validate By name ************************************* */
    validateCategoryByNameDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data = await Service.categoryService.findOne({ name: req.body.name });
                    if (data) {
                        var errors = {
                            success: true,
                            status: 400,
                            msg: "Given Value Is Already Existed"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.role = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE CATEGORY validate By Id ************************************* */
    validateCategoryByIdDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data;
                    let id = req.params.id || req.body.category
                    const checkId = ObjectId.isValid(id);
                    if (!checkId) id = undefined
                    data = await Service.categoryService.findById(id);
                    // if (req.body.hasOwnProperty('category')) {
                    if (!data) {
                        var errors = {
                            success: true,
                            status: 400,
                            msg: "Category Is Not Found With Given Id"
                        };
                        return res.status(400).send(errors);
                    }
                    // } 
                    else {
                        req.category = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    validateCategoryByIdForBookDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data = await Service.categoryService.findById(req.body.category);
                    if (!data) {
                        var errors = {
                            success: true,
                            status: 400,
                            msg: "Category Is Not Found With Given Id"
                        };
                        return res.status(400).send(errors);
                    } else {
                        next()
                    }

                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    validateCategoryByIdForUpdateBookDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    if (req.body.category) {
                        let data = await Service.categoryService.findById(req.body.category);
                        if (!data) {
                            var errors = {
                                success: true,
                                status: 400,
                                msg: "Category Is Not Found With Given Id"
                            };
                            return res.status(400).send(errors);
                        } else {
                            next()
                        }
                    } else {
                        next()
                    }

                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE CATEGORY validate By Id ************************************* */
    validateFile() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    if (req && !req.file) {
                        var errors = {
                            success: true,
                            status: 200,
                            msg: "file is required"
                        };
                        return res.status(200).send(errors);
                    } else {
                        next()
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** image validate ************************************* */
    validateImageById() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let id = req.body.Cover || req.body.profilePic
                    const checkId = ObjectId.isValid(id);
                    if (!checkId) id = undefined
                    const data = await Service.coverService.findById(id)
                    if (!data) {
                        var errors = {
                            success: false,
                            status: 200,
                            msg: "Image is required"
                        };
                        return res.status(200).send(errors);
                    } else {
                        next()
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** Check User Has Image image validate ************************************* */
    validateCheckUserHasImage() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    const data = await Service.coverService.findById(req.user.profilePic)
                    req.cover = data
                    next()
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //***************************************************** PACKAGE SECTION ****************************************************************** */
    //********************** DATABASE PACKAGE validate By name ************************************* */
    validatePackageByNameDB() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    let data = await Service.packageService.findOne({ name: req.body.name });
                    if (data) {
                        var errors = {
                            success: true,
                            status: 400,
                            msg: "Given Value Is Already Existed"
                        };
                        return res.status(400).send(errors);
                    } else {
                        req.package = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }


    //***************************************************** STRIPE SECTION ****************************************************************** */

    //********************** THIRD PARTY DATABASE USER validate By Id OR CREATE BY EMAIL ************************************* */
    validateUserStripeId() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    if (!req.user.customerId == null || !req.user.customerId == undefined || !req.user.customerId == "") {
                        next();
                    } else {
                        const stripeUser = await Service.stripeService.createOrGetCustomer(req.user.customerId, { name: req.user.username, email: req.user.email });
                        req.user = stripeUser;
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** THIRD PARTY DATABASE USER validate By Id OR CREATE BY EMAIL ************************************* */
    validateCheckSubscription() {
        return (
            compose().use(async (req, res, next) => {
                try {

                    const { data } = await Service.orderService.findOne({ createdAt: "" });
                    if (data.length > 0) {
                        return res.status(200).send({ success: false, status: 200, msg: "Your Subscription is Active" });
                    } else {
                        next()
                    }
                } catch (error) {
                    res.status(500).send({ success: false, status: 500, msg: error.message });
                }
            })
        )
    }

    //********************** DATABASE USER validate By Id package ************************************* */
    validateCheckSubscription() {
        return (
            compose().use(async (req, res, next) => {
                try {

                    const { data } = await Service.stripeService.findSubscriptions({ customer: req.user.customerId, limit: 1 });
                    if (data.length > 0) {
                        return res.status(200).send({ success: false, status: 200, msg: "Your Subscription is Active" });
                    } else {
                        next()
                    }
                } catch (error) {
                    res.status(500).send({ success: false, status: 500, msg: error.message });
                }
            })
        )
    }

    //********************** THIRD PARTY DATABASE SUBSCRIPTION validate By CUSTOMER ************************************* */
    validateSubscriptionById() {
        return (
            compose().use(async (req, res, next) => {
                try {

                    const { data: [{ id }] } = await Service.stripeService.findSubscriptions({ customer: req.user.customerId, limit: 1 });
                    if (id) {
                        req.user.subscription = id;
                        next()
                    } else {
                        return res.status(400).send({ success: false, status: 400, msg: "No Subscription Is Find" });
                    }
                } catch (error) {
                    res.status(500).send({ success: false, status: 500, msg: error.message });
                }
            })
        )
    }


    //********************** THIRD PARTY DATABASE STRIPE PAYMENT METHOD validate By CUSTOMER ID ************************************* */
    validateCheckPaymentMethod() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    const { data } = await Service.stripeService.createOrGetPaymentMethod(req.user.customerId, req.body);
                    if (data.length > 0) {
                        return res.status(200).send({ success: false, status: 200, msg: "Your Subscription is Active" });
                    } else {
                        next()
                    }
                } catch (error) {
                    res.status(500).send({ success: false, status: 500, msg: error.message });
                }
            })
        )
    }

    //********************** THIRD PARTY DATABASE STRIPE VALIADTE USER OR CREATE ************************************* */
    validateStripeUserOrCreate() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    if (req.user.customerId == null || req.user.customerId == undefined || req.user.customerId == "" || req.user.hasOwnProperty("customerId")) {
                        const { id } = await Service.stripeService.createOrGetCustomer2({ name: req.user.username, email: req.user.email });
                        Service.userService.findOneAndUpdate({ _id: req.user._id }, { $set: { customerId: id } })
                        req.user.customerId = id;
                        next()
                    } else {
                        const { id } = await Service.stripeService.createOrGetCustomer3(req.user.customerId, { name: req.user.username, email: req.user.email });
                        Service.userService.findOneAndUpdate({ _id: req.user._id }, { $set: { customerId: id } })
                        req.user.customerId = id;
                        next()
                    }
                } catch (error) {
                    res.status(500).send({ success: false, status: 500, msg: error.message });
                }
            })
        )
    }


    //***************************************************** GOOGLE SECTION ****************************************************************** */

    //********************** THIRD PARTY GOOGLE DRIVE DATABASE GET ALL BOOKS FROM FOLDER ID FOR CREATE BOOK ************************************* */
    validateGoogleFolderByID() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    const { data } = await Service.googleDriveService.findSingleFolder(req.body.FolderID);

                    if (!data) {
                        return res.status(200).send({ success: false, status: 200, msg: "Please Give A Valid Folder Id" });
                    } else {
                        req.googleFolder = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** THIRD PARTY GOOGLE DRIVE DATABASE GET ALL BOOKS FROM FOLDER ID FOR UPDATE BOOK ************************************* */
    validateGoogleFolderByIDForUpdatBook() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    if (req.body.FolderID) {
                        const { data } = await Service.googleDriveService.findSingleFolder(req.body.FolderID);

                        if (!data) {
                            return res.status(200).send({ success: false, status: 200, msg: "Please Give A Valid Folder Id" });
                        } else {
                            req.googleFolder = data
                            next();
                        }
                    } else {
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** THIRD PARTY GOOGLE DRIVE DATABASE VALIDATE SEASON DOC ID ************************************* */
    validateGoogleDocByID() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    const { data } = await Service.googleDriveService.findSingleFile(req.body.season);

                    if (!data) {
                        return res.status(200).send({ success: false, status: 200, msg: "Please Give A Valid google file Id" });
                    } else {
                        if (data.mimeType != 'application/vnd.google-apps.document') return res.status(200).send({ success: false, status: 200, msg: "invalid season id" });
                        req.googleFolder = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** THIRD PARTY GOOGLE DRIVE DATABASE VALIDATE SEASON DOC ID ************************************* */
    validateGoogleDocByIDCreate() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    const { data } = await Service.googleDriveService.findSingleFile(req.body.season);
                    if (!data) {
                        return res.status(200).send({ success: false, status: 200, msg: "Please Give A Valid Doc Id" });
                    } else {
                        req.googleDoc = data
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //********************** Get Season By Season Id For Checking ************************************* */
    validateSeasonByIdForChapter() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    const season = await Service.seasonService.findOne({ book: req.body.book, _id: req.body.season });

                    if (!season) {
                        return res.status(200).send({ success: false, status: 200, msg: "Invalid season Id" });
                    } else {
                        req.season = season
                        next();
                    }
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //***************************************************** FAVORITE BOOK SECTION ****************************************************************** */

    //********************** FAVORITE BOOKS LIKE CHECK ************************************* */
    validateCheckLikeBook() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    req.body.userId = req.user._id
                    console.log(req.body)
                    const data = await Service.favoriteBookService.checklike(req.body);
                    req.checkLike = data
                    next();
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

    //***************************************************** COMMENT BOOK SECTION ****************************************************************** */

    //********************** FAVORITE BOOKS LIKE CHECK ************************************* */
    validateCheckCommentBook() {
        return (
            compose().use(async (req, res, next) => {
                try {
                    const data = await Service.commentService.findOne({ _id: req.params.id, userId: req.user._id });
                    if (!data) return res.status(200).send({ status: 200, success: false, msg: "No Data Is Found With Given Id" });
                    req.comment = data
                    next();
                } catch (error) {
                    res.status(500).send({ success: false, msg: error.message });
                }
            })
        )
    }

}
