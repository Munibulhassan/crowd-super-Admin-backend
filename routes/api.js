const express = require("express");
const app = express();

// Super Admin Routes
app.use("/superAdmin/user", require("../app/controller/user"));
app.use("/superAdmin/department", require("../app/controller/department/superAdmin"));
app.use("/superAdmin/vanue", require("../app/controller/vanue/superAdmin"));
app.use("/superAdmin/excelTomongo", require("../app/controller/excelTomongo/superAdmin"));
app.use("/superAdmin/fa", require("../app/controller/fa/superAdmin"));
app.use("/superAdmin/position", require("../app/controller/position/superAdmin"));
app.use("/superAdmin/history", require("../app/controller/history/superAdmin"));
app.use("/superAdmin/role", require("../app/controller/role/superAdmin"));
app.use("/superAdmin/zone", require("../app/controller/zone/superAdmin"));



module.exports = app;