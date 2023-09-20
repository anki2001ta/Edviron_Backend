const express = require("express");

const router = express.Router();

const paymentcontroller = require("../controller/feeheadcontroller");
const transactionpercentage = require("../controller/transaction");
const payments = require("../controller/paymentcontroller");
const students = require("../controller/studentcontroller");

router.post("/addpayment", paymentcontroller.createfeehead);

router.get("/students", students.getstudent);
router.get('/getadmins',students.getaAdmins);

router.get("/getpercentage", transactionpercentage.getpercentage);
router.get("/gettotalamount", transactionpercentage.totalcollection);
router.get("/getmonthtotal", transactionpercentage.collectionInmonths);
router.post("/createTransaction", transactionpercentage.createtransaction);
router.get('/gettransaction', transactionpercentage.gettransactions);

router.post("/updatepayment", payments.updatepayment);
 router.get('/getdefaulter', students.getdefaultstudent);
 router.get("/getfineamount", payments.getfineamount);
module.exports = router;
        