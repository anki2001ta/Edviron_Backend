const mongoose = require("mongoose");

const feehead = new mongoose.Schema({
  frquency_months: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
  },
  amount: {
    type: String,
  },
  start_date: {
    type: Date,
  },
});

const feeheadmodel = mongoose.model("feehead", feehead);

module.exports = feeheadmodel;
