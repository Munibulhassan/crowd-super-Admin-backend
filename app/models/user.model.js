"use strict";
const mongoose = require("mongoose");

const mongooseSerial = require("mongoose-serial")

const UserSchema = new mongoose.Schema({
    firstName:{
        type: String,
    },
	lastName:{
        type: String,
    },
	email:{
        type: String,
        unique: true,
        required: true
    },
	password:{
        type: String,
        required: true
    },
	dataOfBirth:{
        type: Date,
    },
	phone:{
        type: String,
    },
	venue:{
        type: String,
    },
	position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position',
    },		                      //Functional Area / Job Title / Venue
	jobType:{
        type: String,
        enum: ["contract", "paid", ""],
        default: ""
    },		                      //[contract, paid]
	department:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    },
	status:{
        type: String,
        enum: ["busy", "active", "asign", "onVecation", 'absence', 'leaveJob',"free","" ],
        default: "free"
    },			
	role:{
        type: String,
        enum:["employee","super_admin", "super_user", "lead", "client"],
        default: "employee"
    } ,			//[employee, manager, super_admin, super_user, lead, client]
	employeeId:{
        type: String,
        default:0
    },
	lead:{
        type: String,
        default:""
    },		
	manager	:{
        type: String,
        default:""
    },	
	dataOfJoining:{
        type: Date,
        default:new Date()
    },
    address:{
        type: String,
        default:""
    },
	gender:{
        type: String,
        enum:["male", "female",""],
        default: ""
    } 		//[male, female]
}, {
    timestamps: true
});

UserSchema.plugin(mongooseSerial, { field:"employeeId", digits:3});

UserSchema.pre('save', function(next) {
    next()
  });

exports.User = mongoose.model("User", UserSchema);