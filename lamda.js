const express = require("express");
const sls = require("serverless-http");
const app = express();
// const student = require("./src/controller/studentcontroller");

const dues = require("./src/model/Dues");

const payment = require("./src/model/payments");

app.get("/getdefaulter", async (req, res, next) => {
  const count = 0;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 2;
  const matchingDueDate = [];

  try {
    await dues
      .findOne({
        $expr: {
          $and: [
            { $eq: [{ $year: "$due_date" }, year] },
            { $eq: [{ $month: "$due_date" }, month] },
          ],
        },
      })
      .then((duedate) => {
        matchingDueDate.push(duedate);
      });

    for (let i = 0; i < matchingDueDate.length; i++) {
      const timeDifferenceMilliseconds =
        currentDate - matchingDueDate[i].due_date;
      const daysDifference = Math.floor(
        timeDifferenceMilliseconds / (1000 * 60 * 60 * 24)
      );
      console.log(daysDifference);
      if (daysDifference > 0) {
        const studentid = matchingDueDate[i].student;
        const result = await payment.find({ student: studentid });
        if (!result) {
          count++;
        }
      }
    }

    res.status(200).send(count);
  } catch (error) {
    res.status(500).json({ message: "not found" });
  }

  console.log(matchingDueDate);

  res.status(200).send("Hello World!");
});

module.exports.handler = sls(app);
