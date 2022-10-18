"use strict";
const mongoose = require("mongoose");


const FASchema = new mongoose.Schema({
    functionalarea:{
        type: String,
        unique: true,
        required: true
    },
	facode:{
        type: String,
        uppercase:true,
        required: true,
        unique: true,

    },
    jobtype:{
        type:String
    },
	jobtitle:{
        type: [],
    },
    rolecode:{
        type: String,
    },

}, {
    timestamps: true
});

exports.FA = mongoose.model("FA", FASchema);