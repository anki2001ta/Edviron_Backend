const mongoose = require("mongoose");
const express= require('express');
const server= express();
const app = require("./app");
require("dotenv").config()
const{dataconnection}=require("./Config/config")

// mongoose
//   .connect("mongodb+srv://assignment:edviron@cluster1.focovdw.mongodb.net/", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("connected to mongodb");
//   });
// console.log(process.env.mongoose_url)
mongoose
  .connect(process.env.moongoseAtlasurl, {
   
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongodb");
  });

// app.listen(8000, () => {
//   console.log("listening on 8000");
// });

app.listen(process.env.port,async()=>{
  // try{
  //     await dataconnection
  // }
  // catch(err){
  //     console.log(err)
  //     console.log("Database connection Failed")
  // }
  console.log(`Running on port ${process.env.port}`)
})