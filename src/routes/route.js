const express = require("express");

const router = express.Router();

const paymentcontroller = require("../controller/feeheadcontroller");
const transactionpercentage = require("../controller/transaction");
const payments = require("../controller/paymentcontroller");
const students = require("../controller/studentcontroller");

router.post("/getpayment", paymentcontroller.createfeehead);

router.get("/getstudent", students.getstudent);

router.get("/getpercentage", transactionpercentage.getpercentage);
router.get("/gettotalamount", transactionpercentage.totalcollection);
router.get("/getmonthtotal", transactionpercentage.collectionInmonths);

router.post("/transaction", transactionpercentage.createtransaction);

router.post("/updatepayment", payments.updatepayment);
// router.get('/getdefaulter', students.getdefaultstudent);
module.exports = router;
