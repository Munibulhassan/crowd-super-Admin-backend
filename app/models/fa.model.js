"use strict";
const mongoose = require("mongoose");


const FASchema = new mongoose.Schema({
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

exports.FA = mongoose.model("FA", FASchema);