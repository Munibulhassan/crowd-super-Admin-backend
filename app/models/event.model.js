"use strict";
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    descriptoin: {
      type: String,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    eventytype: {
      type: String,
    },
    totaldays: {
      type: String,
    },
    peakshift: {
      type: String,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vanue",
    },
  },
  {
    timestamps: true,
  }
);

exports.Event = mongoose.model("event", eventSchema);
