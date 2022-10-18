"use strict";
const mongoose = require("mongoose");

const mongooseSerial = require("mongoose-serial");

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
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    dataOfBirth: {
      type: Date,
    },
    phone: {
      type: String,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vanue",
    },
    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
    }, //Functional Area / Job Title / Venue
    jobType:{
        type: String,
        enum: ["contract", "paid", ""],
        default: ""
    },		                      //[contract, paid]
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    profileimage: { type: String },
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
    employeeId: {
      type: String,
      default: 0,
    },
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
    gender: {
      type: String,
      enum: ["male", "female", ""],
      default: "",
    },
    percentage: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(mongooseSerial, { field: "employeeId", digits: 3 });

UserSchema.pre("save", function (next) {
  next();
});

exports.User = mongoose.model("User", UserSchema);
