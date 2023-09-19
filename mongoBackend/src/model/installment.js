const mongoose = require("mongoose");

const dues = require("./Dues");

const installment = new mongoose.Schema(
  {
    due_dates: [],
  },
  {
    timestamps: true,
  }
);

const Installment = mongoose.model("installments", installment);

module.exports = Installment;
