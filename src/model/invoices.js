const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    dues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dues" }], // Assuming dues are references to another model
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"], // Example validation for status
      default: "pending", // Example default value
    },
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "payments",
      },
    ],
    student:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "student"
    },
    fine_days: {
      type: Number,
      default: 0, // Example default value
    },
    fine_amount: {
      type: Number,
      default: 0, // Example default value
    },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
