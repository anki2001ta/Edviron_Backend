const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const rout = require("./routes/route");
app.use(
    cors({
      origin: "*",
    })
  );
  
app.use("/", rout);

module.exports =  app ;
