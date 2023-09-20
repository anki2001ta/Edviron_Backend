const transactions = require("../model/transaction");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const dues = require("../model/Dues");
const payment = require("../model/payments");
const invoice= require('../model/invoices');

const updatepayment = async (req, res) => {
  const transactionid = req.body.id;

  const transaction = await transactions.findById(transactionid);

  if(transaction.status!="SUCCESS"){
     res.status(200).json({message: "transaction failes"});
  }

  const student_id = transaction.student._id;

  const objectId = new ObjectId(student_id);

  // Get the ID as a string
  const finalid = objectId.toString();

  const due_dates = await dues.find({ student: finalid });
  // console.log(due_dates);
  const duedate = findDueDate(transaction.createdAt, due_dates);
  console.log(duedate);
  try {
    const temp = due_dates[0].fee_head;

    const feehead = new ObjectId(temp).toString();
    console.log(feehead);

    await payment.create({
      fee_head: feehead,
      due_date: duedate,
      student: student_id,
    });

    res.status(200).json({ message: "created successfully" });
  } catch (error) {
    res.status(500).json({ message: "error creating" });
  }
};

const getfineamount= async (req,res) => {
try{
  const invoices= await invoice.find();
  const totalAmount = invoices.reduce(
    (totalfine, Invoice) => totalfine + Invoice.fine_amount,
    0
  );

  console.log(totalAmount);

  res.json(totalAmount);
}catch(error){
  res.status(500).json({message:"error while fetching fine amount"});
}
   
}




function findDueDate(targetDate, dates) {
  var currentDate = new Date(targetDate);
  //   console.log(currentDate.toDateString()); // added parentheses to call the function
  const year = currentDate.getFullYear(); // removed getUTCFullYear()
  const month = currentDate.getMonth() + 2;

  console.log(year, month);

  const matchingDates = [];

  for (let i = 0; i < dates.length; i++) {
    // console.log(dates[i].due_date);
    const date = new Date(dates[i].due_date);
    console.log(date.getFullYear());
    if (date.getFullYear() === year && date.getMonth() + 1 === month) {
      console.log(date);
      matchingDates.push(date);
    }
  }

  // console.log(matchingDates);

  return matchingDates.length > 0 ? matchingDates[0] : null; // return the first matching date or null if none found
}

module.exports = { updatepayment, getfineamount };
