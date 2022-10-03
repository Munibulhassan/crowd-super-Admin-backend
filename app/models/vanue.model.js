"use strict";
const mongoose = require("mongoose");

const VanueSchema = new mongoose.Schema({
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

exports.Vanue = mongoose.model("Vanue", VanueSchema);