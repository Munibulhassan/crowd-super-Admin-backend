"use strict";
const mongoose = require("mongoose");


const HeadCountSchema = new mongoose.Schema({
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "event",
    },
    functionalarea:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "FA",

    },
	startdate:{
        type: String,        
        required: true
    },
   totaldays:{
        type: String,        
        required: true
    },
    shifttime:{
        type: String,        
        required: true
    },
    headcount:{
        type: String,        
        required: true
    },
    peakshift:{
        type: String,        
        required: true
    },
    peakshiftheadcount:{
        type: String,        
        required: true
    },
    
}, {
    timestamps: true
});

exports.HeadCount = mongoose.model("HeadCount", HeadCountSchema);