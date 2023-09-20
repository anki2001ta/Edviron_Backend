const { response } = require("../app");
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
      online: Math.floor(onlinePercentage),
      cash: Math.floor(cashPercentage),
      cheque: Math.floor(chequePercentage),
    };
    const data = [
      {
        label: "Online",
        value: percentages.online,
      },
      {
        label: "Cash",
        value: percentages.cash,
      },
      {
        label: "Cheque",
        value: percentages.cheque,
      },
    ];

    res.json(data);
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
  let totalmonthscollection = 0;

  try {
    // Get the current date to determine the month and year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Initialize an array to store monthly totals
    const monthlyTotals = [];

    // Loop through each month of the current year
    for (let month = 0; month <= currentMonth; month++) {
      // Calculate the first day of the current month
      const firstDayOfMonth = new Date(currentYear, month, 1);

      // Calculate the last day of the current month
      const lastDayOfMonth = new Date(currentYear, month + 1, 0, 23, 59, 59);

      // Query the database for "success" transactions within the current month
      const successTransactions = await transaction.find({
        status: "SUCCESS",
        createdAt: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      });

      // Calculate the total amount for "success" transactions
      const totalAmount = successTransactions.reduce((acc, Transaction) => {
        return acc + Transaction.amount;
      }, 0);

      const monthName = firstDayOfMonth.toLocaleString('default', { month: 'long' });

      console.log(monthName);

      // Add the monthly total to the array
      monthlyTotals.push({
        month: monthName,
        year: currentYear,
        totalAmount: totalAmount,
      });
      totalmonthscollection = totalmonthscollection + totalAmount;
    }
    const monthlystatus = {
      months: monthlyTotals,
      totals: totalmonthscollection,
    };

    // console.log(monthlystatus);

    res.json(monthlystatus);
  } catch (error) {
    console.error("Error calculating monthly totals:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const gettransactions = async (req, res) => {
  try {
    // Fetch data from the database
    const transactions = await transaction.find({});

    // Map the data to the desired format
    const formattedData = transactions.map((transaction) => {
      const date = new Date(transaction.createdAt); // Assuming createdAt is the date field
      const formattedDate = `${date.toLocaleString("en-us", {
        month: "long",
      })} ${date.getDate()}, ${date.getFullYear()}`;

      let status = "Pending";
      if (transaction.status === "SUCCESS") {
        status = "Successful";
      }
      return {
        date: formattedDate,
        amount: transaction.amount, // Assuming student has a 'name' field
        status: status,
      };
    });

    const data = [];
    if (formattedData.length > 4) {
      for (let i = 0; i < 4; i++) {
        data.push(formattedData[i]);
      }
      res.send(data);
    }

    res.send(formattedData);
  } catch (erro) {
    res.status(500).json({ message: "error while fetching data" });
  }
};

// Call the function to calculate the total for the current month

module.exports = {
  getpercentage,
  totalcollection,
  collectionInmonths,
  createtransaction,
  gettransactions,
};
