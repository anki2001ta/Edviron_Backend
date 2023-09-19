const mongoose = require("mongoose");
const express= require('express');
const server= express();
const app = require("./app");
const env = require("dotenv");
env.config();
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
  .connect(process.env.mongoose_url, {
   
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongodb");
  });

app.listen(process.env.port, () => {
  console.log("listening on 8000");
});
