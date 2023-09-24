const mongoose = require("mongoose");

const feehead = new mongoose.Schema({
  frequency_months: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
  },
  amount: {
    type: String,
  },
  class:{
    type: Number,
    require: true
  },
  section:{
   type:String
  },
  start_date: {
    type: Date,
  },
});

const feeheadmodel = mongoose.model("feehead", feehead);

module.exports = feeheadmodel;
