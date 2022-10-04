"use strict";
const mongoose = require("mongoose");

const VanueSchema = new mongoose.Schema({
    venuename:{
        type: String,
        unique: true,
        required: true
    },
	venuecode:{
        type: String,
        uppercase:true,
        required: true
    },
	
}, {
    timestamps: true
});

exports.Vanue = mongoose.model("Vanue", VanueSchema);