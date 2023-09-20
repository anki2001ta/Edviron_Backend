const studentData = require("../../db/db.json");
const admins= require('../../db/admins.json')
const dues = require("../model/Dues");

const payment = require("../model/payments");

const getstudent = async (req, res) => {
  res.send(studentData);
};

const getaAdmins= async(req, res)=>{
   res.send(admins);
}

const getdefaultstudent = async (req, res) => {
  const count = 0;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
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

    res.json(count);
  } catch (error) {
    console.log(error);
  }

  console.log(matchingDueDate);
};

module.exports = { getstudent, getdefaultstudent, getaAdmins };
