"use strict";
const mongoose = require("mongoose");

const PositionSchema = new mongoose.Schema(
  {
    function: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FA",
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vanue",
    },
    workforcetype:{
      type:String,
      enum:["Contractor","Permanent"]

    },

    jobTitle: {
      type: String,
    },

    startDate: {
      type: Date,
      default: new Date(),
    },
    endDate: {
      type: String,
      default: "",
    },
    totalDemand: {
      type: Number,
      default: 0,
    },
    peakShift: {
      type: Number,
      default: 0,
    },
    shiftsPerDay: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

exports.Position = mongoose.model("Position", PositionSchema);
