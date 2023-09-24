const fee_head = require("../model/feehead");
const studentservice = require("../services/studentservice");
const mongoose = require("mongoose");
const dues = require("../model/Dues");
const ObjectId = mongoose.Types.ObjectId;
const install = require("../model/installment");
const invoice = require("../model/invoices");


//CODE UPDATE
// 1. Now frequency month is following the cycle if the frequency month is 3 then it will follow the cycle of 3-3-3-3
// so in that case the dues will be 4
// 2. if frequency month is 12 which means its a complete so in that case due is 1
// 3. if frequency month is 1 than dues will be 12

const createfeehead = async (req, res) => {
  const { frequency_months, name, amount,Class,section } = req.body;

  try {
    // Create the fee_head document
    const feeheaddoc = await fee_head.create({
      frequency_months, //12 ----------------dues will eb created for 1
      name,
      amount,
      class:Class,
      section,
      start_date: new Date(),
    });
    console.log(frequency_months, "frequency_months");

    // Create dues documents and store due dates

    // console.log(frequency, "frequency");
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
  let c = Math.ceil(12 / numinstallments);
  const installmentamount = Math.ceil(amount / c);

  const installments = [];

  if (numinstallments == 12) {
    const installment = {
      amount: installmentamount,
      dueDate: calculateDueDate(numinstallments),
    };
    installments.push(installment);
  } else if (numinstallments == 0) {
    return null;
  } else {
    let i = 0;
    let c= numinstallments;
    while (i < 12) {
      
      let duedate = calculateDueDate(i + 1);
      const installment = {
        amount: installmentamount,
        dueDate: duedate,
      };
      console.log(i);
      i=i+numinstallments;

      installments.push(installment);
    }
  }

  return installments;
}

function calculateDueDate(installmentNumber) {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + installmentNumber;
  const day = now.getDate();

  if (month > 12) {
    year += Math.floor(month / 12);
    month = month % 12; 
  }
  //console.log(year);
  //const dueMonth = now.getMonth() + 1 + numinstallments; // Adding numinstallments to the current month
  // Subtract 1 from month since months are 0-based
  const dueDate = new Date(year, month - 1, day); 
  return dueDate;
}



module.exports = { createfeehead };
