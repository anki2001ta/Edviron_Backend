const express = require("express");
const sls = require("serverless-http");
const app = express();
// const student = require("./src/controller/studentcontroller");

const dues = require("./src/model/Dues");
const payment = require("./src/model/payments");

app.post("/getdefaulter", async (req, res, next) => {
  const Class= req.body.class;
  const section= req.body.section;

  let count = 0;
  const classSectionResults = {};
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

      // console.log(timeDifferenceMilliseconds);
      const daysDifference = Math.floor(
        timeDifferenceMilliseconds / (1000 * 60 * 60 * 24)
      );
      console.log(daysDifference);
      if (daysDifference > 0) {
        const studentid = matchingDueDate[i].student;
        const feeheadid = matchingDueDate[i].fee_head;

        const feehead = await fee_head.find({ _id: feeheadid });
        const Class = feehead[0].class;
        const section = feehead[0].section;

        //  console.log(Class);
        //console.log(studentid);
        if (!classSectionResults[Class]) {
          classSectionResults[Class] = {};
        }

        if (!classSectionResults[Class][section]) {
          classSectionResults[Class][section] = [];
        }

        const result = await payment.find({ student: studentid });

        //console.log(result);
        if (result.length == 0) {
          count++;
        }
        // console.log(count);
        classSectionResults[Class][section].push(count);
      }
    }

    res.json(classSectionResults[Class][section]);
  } catch (error) {
    console.log(error);
  }

  console.log(matchingDueDate);
});

// get defaulters by school_id
app.get("/getdefaulterbyid" )= async (req, res) => {
  const schoolid = req.query.schoolid;
  console.log(schoolid);
  let count = 0;
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

      // console.log(timeDifferenceMilliseconds);
      const daysDifference = Math.floor(
        timeDifferenceMilliseconds / (1000 * 60 * 60 * 24)
      );
      console.log(daysDifference);
      if (daysDifference > 0) {
        const studentid = matchingDueDate[i].student;

        const objectId = new ObjectId(studentid._id);

        // Get the ID as a string
        const finalid = objectId.toString();

        const school = await studentservice.findschoolid(finalid);
        console.log(school);
        const finalschoolid = school["$oid"];
        console.log(c, "c");

        if (schoolid !== finalschoolid) {
          return res.status(200).json({ message: "schoolid not found" });
        }

        const result = await payment.find({ student: studentid });

        //console.log(result);
        if (result.length == 0) {
          count++;
        }
        // console.log(count);
      }
    }

    res.json(count);
  } catch (error) {
    console.log(error);
  }
};

module.exports.handler = sls(app);
