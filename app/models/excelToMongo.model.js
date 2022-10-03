"use strict";
const mongoose = require("mongoose");


const ExcelToMongoSchema = new mongoose.Schema({
    faCode:{
        type: String,
    },
	venueCode:{
        type: String,
    },
	workforceType:{
        type: String,
    },
	jobTitle:{
        type: String,
    },
	startDate:{
        type: Date,
    },
	finishDate:{
        type: String,
    },
	totalDemand:{
        type: String,
    },
	peakShift: {
        type: String,
    },		                     
	shiftsPerDay:{
        type: String,
    },		                     
	
}, {
    timestamps: true
});

ExcelToMongoSchema.index({ faCode: 1, venueCode: 1,workforceType:1,jobTitle:1,startDate:1,finishDate:1,totalDemand:1,peakShift:1,
    shiftsPerDay:1}, { unique: true })
exports.ExcelToMongo = mongoose.model("excelToMongo", ExcelToMongoSchema);