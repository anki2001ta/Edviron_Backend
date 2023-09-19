const transaction = require("../model/transaction");

const studentservice = require("../services/studentservice");

const createtransaction = async (req, res) => {
  const { status, amount, payment_mode, name } = req.body;

  const student_id = await studentservice.findstudent(name);

  console.log(student_id);

  try {
    await transaction.create({
      status,
      amount,
      payment_mode,
      student: student_id,
    });

    res.status(200).json({ message: "transaction created successfully" });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

const getpercentage = async (req, res) => {
  try {
    const transactions = await transaction.find();

    const totalTransactions = transactions.length;
    const onlinePayments = transactions.filter(
      (t) => t.payment_mode === "ONLINE"
    ).length;
    const cashPayments = transactions.filter(
      (t) => t.payment_mode === "CASH"
    ).length;
    const chequePayments = transactions.filter(
      (t) => t.payment_mode === "CHEQUE"
    ).length;

     console.log(totalTransactions);
    const onlinePercentage = (onlinePayments / totalTransactions) * 100;
    const cashPercentage = (cashPayments / totalTransactions) * 100;
    const chequePercentage = (chequePayments / totalTransactions) * 100;

    const percentages = {
      online: onlinePercentage,
      cash: cashPercentage,
      cheque: chequePercentage,
    };

    res.json(percentages);
  } catch (err) {
    res.status(400).json({ message: "error getting transaction" });
  }
};

const totalcollection = async (req, res) => {
  try {
    const transactions = await transaction.find({ status: "SUCCESS" });
    const totalAmount = transactions.reduce(
      (total, Transaction) => total + Transaction.amount,
      0
    );

    console.log("Total Amount for 'success' status:", totalAmount);
    res.json(totalAmount);
  } catch (err) {
    console.error("Error calculating total amount:", err);
    throw err;
  }
};

const collectionInmonths = async (req, res) => {
  try {
    // Get the current date to determine the month and year
    const currentDate = new Date("2023-04-13T06:48:56.128+00:00");
    // Calculate the first day of the current month
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // Calculate the last day of the current month
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    // Query the database for "success" transactions within the current month
    const successTransactions = await transaction.find({
      status: "success",
      createdAt: {
        $gte: firstDayOfMonth,
        $lte: lastDayOfMonth,
      },
    });

    // Calculate the total amount for "success" transactions
    const totalAmount = successTransactions.reduce((acc, Transaction) => {
      return acc + Transaction.amount;
    }, 0);

    console.log(
      `Total amount for "success" transactions in ${currentDate.toLocaleString(
        "default",
        { month: "long" }
      )}: ${totalAmount}`
    );

    res.json(totalAmount);
  } catch (error) {
    console.error("Error calculating monthly total:", error);
  }
};

// Call the function to calculate the total for the current month

module.exports = { getpercentage, totalcollection, collectionInmonths, createtransaction};
