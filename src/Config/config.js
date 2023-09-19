require('dotenv').config();
const mongoose=require("mongoose")

const dataconnection=mongoose.connect(process.env.moongoseAtlasurl);

module.exports={dataconnection}