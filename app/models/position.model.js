"use strict";
const mongoose = require("mongoose");

const PositionSchema = new mongoose.Schema(
  {
    functionarea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FA",
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vanue",
    },
    workforcetype: {
      type: String,
      enum: ["Contractor", "Permanent"],
    },

    jobTitle: {
      type: String,
    },

    startDate: {
      type: Date,
      default: new Date(),
    },
    endDate: {
      type: Date,

      default:  new Date(),
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
