const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  phone_number: {
    type: Number,
  },

  class: {
    type: String,
  },
  section: {
    type: String,
  },
  category: {
    type: String,
  },
  dob: {
    $date: {
      type: Date,
    },
  },
  gender: {
    type: String,
  },
  previous_session_dues: {
    type: Number,
  },
});

const students = mongoose.model("studentSchema", studentSchema);

module.exports = students;
