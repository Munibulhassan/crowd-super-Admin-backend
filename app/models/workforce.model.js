"use strict";
const mongoose = require("mongoose");

const mongooseSerial = require("mongoose-serial");
const { createShortUuid } = require("../utils/common");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      // required: true,
    },
    password: {
      type: String,
      // required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    phone: {
      type: String,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vanue",
    },
    functionalarea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FA",
    },
    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
    }, //Functional Area / Job Title / Venue

    workforcetype: {
      type: String,
      enum: ["Contractor", "Paid Staff"],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    profileimage: { type: String, default: 'model.png' }, 
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    role: {
      type: String,
      enum: ["employee", "super_admin", "super_user", "lead", "client"],
      default: "employee",
    }, //[employee, manager, super_admin, super_user, lead, client]

    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dataOfJoining: {
      type: Date,
      default: new Date(),
    },
    address: {
      type: String,
      default: "",
    },
    employeeid: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", ""],
      default: "",
    },
    percentage: {
      type: Number,
    },
    editimage:{
      type:Boolean,
      default: false
    }, 
    idnumber: {
      type: String,
    },
    idexpiry: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

// UserSchema.plugin(mongooseSerial, { field: "employeeId", digits: 3 });

// UserSchema.pre("save", function (next) {
//   next();
// });

exports.User = mongoose.model("User", UserSchema);
