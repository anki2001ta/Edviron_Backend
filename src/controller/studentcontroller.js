const studentData = require("../../db/db.json");
const admins = require("../../db/admins.json");
const dues = require("../model/Dues");
const fee_head = require("../model/feehead");
const payment = require("../model/payments");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const studentservice = require("../services/studentservice");
const { request } = require("../app");

const getstudent = async (req, res) => {
  res.send(studentData);
};

const getaAdmins = async (req, res) => {
  res.send(admins);
};

const getdefaultstudent = async (req, res) => {

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
};

const getdefaulterBySchoolId = async (req, res) => {
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

module.exports = {
  getstudent,
  getdefaultstudent,
  getaAdmins,
  getdefaulterBySchoolId,
};