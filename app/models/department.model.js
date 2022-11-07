"use strict";
const mongoose = require("mongoose");


const DepartmentSchema = new mongoose.Schema({
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
    totalfunction:{type:Number,default:0}
    

}, {
    timestamps: true
});

exports.Department = mongoose.model("Department", DepartmentSchema);