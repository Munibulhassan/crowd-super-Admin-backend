"use strict";

const { User } = require("../models/user.model");

exports.getAllHeadCount = function () {
  return new Promise(function (resolve, reject) {
    User.aggregate(
      [

        { $project: { department: 1,status:1 , _id: 0 } },
        {
            $match : { status:"active" }
          },
        {
          $lookup: {
            from: "departments",
            localField: "department",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 0, name: 1 } }],
            as: "department",
          },
        },
        { $unwind: { path: "$department" } },
        {
          $group: {
            _id: "$department.name",
            qty: {$sum:1}
          },
        },
        {
            $project: {
              department: "$_id" || 0,
              qty: "$qty" || 0,
              _id:0
            },
          },
      ],
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

exports.Model = User;
