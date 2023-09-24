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

const findnameofstudent= async (id) =>{

  let name;
   students.students.map((item)=>{
     if(item._id==id)
     {
       name= item.name;
     }
   })

   return name;
}

const findschoolid= async(id)=>{
  let schoolid;
  students.students.map((item)=>{
    if(item._id==id)
    {
      schoolid=item.school_id;
    }
  })
  return schoolid;
}
module.exports= {findstudent, findnameofstudent,findschoolid};
