"use strict";
const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema({
    name:{
        type: String,
        unique: true,
        required: true
    },
	code:{
        type: String,
        uppercase:true,
        required: true
    },
	description:{
        type: String,
    },
}, {
    timestamps: true
});

exports.Zone = mongoose.model("Zone", ZoneSchema);