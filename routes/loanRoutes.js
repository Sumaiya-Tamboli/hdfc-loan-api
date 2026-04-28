const express = require("express");
const router = express.Router();

const {
    initiateCustomerIdentification,
    verifyOTPAndGetDemogDetails,
    finalSubmission
} = require("../controllers/loanController");

router.post("/initiateCustomerIdentification", initiateCustomerIdentification);
router.post("/verifyOTPAndGetDemogDetails", verifyOTPAndGetDemogDetails);
router.post("/finalSubmission", finalSubmission);

module.exports = router;