"use strict";
const mongoose = require("mongoose");


const PositionSchema = new mongoose.Schema({
    faCode:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FA',
    },
	venueCode:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vanue',
    },
	workforceType:{
        type: String,
        enum: ["paid", "contract", ""],
        default: ""
    },
	jobTitle:{
        type: String,
    },
	startDate:{
        type: Date,
        default: new Date(),
    },
	finishDate:{
        type: String,
        default:""
    },
	totalDemand:{
        type: Number,
        default:0
    },
	peakShift: {
        type: Number,
        default:0
    },		                     
	shiftsPerDay:{
        type: Number,
        default:0
    },

}, {
    timestamps: true
});

exports.Position = mongoose.model("Position", PositionSchema);