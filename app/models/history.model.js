"use strict";
const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
    type:{
        type: String,
        required: true
    },
    modal: {
        type:String,
        required: true
    },
	previouseState:{
        type: String,
    },
	changeState:{
        type: String,
    },
    changeTime:{
        type:Date,
        default: new Date()
    }
}, {
    timestamps: true
});

exports.History = mongoose.model("History", HistorySchema);