"use strict";
const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
    name:{
        type: String,
        unique: true,
        required: true
    },
	description:{
        type: String,
    },
}, {
    timestamps: true
});

exports.Role = mongoose.model("Role", RoleSchema);