const fee_head = require("../model/feehead");

const studentservice = require("../services/studentservice");
const mongoose = require("mongoose");
const dues = require("../model/Dues");
const ObjectId = mongoose.Types.ObjectId;;

const install = require("../model/installment");

const invoice = require("../model/invoices");

const createfeehead = async (req, res) => {
  const { frequency_months, name, amount } = req.body;

  try {
    // Create the fee_head document
    const feeheaddoc = await fee_head.create({
      frequency_months,
      name,
      amount,
      start_date: new Date(),
    });

    // Create dues documents and store due dates
    const installment = converttoinstallment(amount, frequency_months);
    const dueDates = [];
    const duesid = [];
    const student_id = await studentservice.findstudent(name);
    
    console.log(student_id);

    for (const item of installment) {
      const dueDoc = await dues.create({
        fee_head: feeheaddoc._id,
        due_date: item.dueDate,
        student: student_id,
      });
      dueDates.push(dueDoc.due_date);
      duesid.push(dueDoc._id); // Store due dates
    }

    // Create install document with due dates
    await install.create({
      due_date: dueDates,
    });

    await invoice.create({
      dues: duesid,
      student: student_id,
    });

    res.status(200).json({ message: "Created successfully" });
  } catch (err) {
    console.error(err);
    res.status(404).send({ message: "Invalid fee" });
  }
};

function converttoinstallment(amount, numinstallments) {
  const installmentamount = Math.ceil(amount / numinstallments);

  const installments = [];

  for (let i = 0; i < numinstallments; i++) {
    const installment = {
      amount: installmentamount,
      dueDate: calculateDueDate(i + 1),
    };

    installments.push(installment);
  }

  return installments;
}

function calculateDueDate(installmentNumber) {
  // Assuming the due date is one month after the installment date
  const now = new Date();
  const dueDate = new Date(
    now.getFullYear(),
    now.getMonth() + installmentNumber,
    now.getDate()
  );
  return dueDate;
}

module.exports = { createfeehead };
