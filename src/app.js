const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const rout = require("./routes/route");

app.use("/", rout);

module.exports =  app ;
