"use strict";
const mongoose = require("mongoose");

const FASchema = new mongoose.Schema(
  {
    functionalarea: {
      type: String,
      unique: true,
      required: true,
    },
    facode: {
      type: String,
      uppercase: true,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    jobtitle:{
      type:Array
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  },
  {
    timestamps: true,
  }
);

exports.FA = mongoose.model("FA", FASchema);
