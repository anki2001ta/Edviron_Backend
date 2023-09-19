const mongoose = require("mongoose");

const payment = new mongoose.Schema(
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

const payments = mongoose.model("payments", payment);

module.exports = payments;
