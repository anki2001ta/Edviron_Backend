const mongoose = require("mongoose");

const dues = new mongoose.Schema(
  {
    fee_head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "feehead",
    },
    due_date: {
      type: Date,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
  },
  {
    timestamps: true,
  }
);

const Dues = mongoose.model("Dues", dues);

module.exports = Dues;
