const mongoose = require("mongoose");
const express= require('express');
const server= express();

const app = require("./app");

// mongoose
//   .connect("mongodb+srv://assignment:edviron@cluster1.focovdw.mongodb.net/", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("connected to mongodb");
//   });

mongoose
  .connect("mongodb+srv://user:edviron@cluster0.eotptoz.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongodb");
  });

app.listen("8000", () => {
  console.log("listening on 8000");
});
