const students = require("../../db/db.json");

const findstudent = async (name) => {
  let id;
  students.students.map((item) => {
    if (item.name === name) {
      id = item._id;
    }
  });
return id;
};

module.exports= {findstudent};
