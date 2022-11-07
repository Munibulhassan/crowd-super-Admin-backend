"use strict";
const mongoose = require("mongoose");

const VanueSchema = new mongoose.Schema({
    venuename:{
        type: String,
        unique: true,
        required: true
    },
	location:{
        type: String,
    },
    zone:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Zone",

    }

	
}, {
    timestamps: true
});

exports.Vanue = mongoose.model("Vanue", VanueSchema);