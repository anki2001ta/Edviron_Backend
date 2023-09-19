const mongoose = require("mongoose");

const transaction = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "pending",
    },
    amount: {
      type: Number,
    },
    payment_mode: {
      type: String,
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

const Transaction = mongoose.model("Transaction", transaction);

module.exports = Transaction;
