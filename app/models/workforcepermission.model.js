"use strict";
const mongoose = require("mongoose");

const WorkForcePermissionSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

exports.WorkforcePermission = mongoose.model("WorkforcePermission", WorkForcePermissionSchema);
