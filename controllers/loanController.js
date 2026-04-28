const customerData = require("../data/mockData");

let otpStore = {};

exports.initiateCustomerIdentification = (req, res) => {
    const { mobileNo, identifierValue } = req.body.requestString || {};

    if (!mobileNo || !identifierValue) {
        return res.status(400).json({
            status: {
                responseCode: "1",
                errorCode: "INVALID_INPUT",
                errorDesc: "Missing mobileNo or identifierValue"
            }
        });
    }

    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[mobileNo] = {
        otp: generatedOTP,
        expiresAt: Date.now() + 2 * 60 * 1000
    };

    return res.json({
        contextParam: {
            partnerID: "HDFCBANK",
            channelID: "ADOBE",
            productName: "PL",
            partnerJourneyID: Date.now().toString(),
            bankJourneyID: "BK" + Math.floor(Math.random() * 100000000)
        },
        responseString: {
            offerAvailable: "Y",
            existingCustomer: customerData.some(c => c.customerMobileNo === mobileNo) ? "Y" : "N",
            otp: generatedOTP
        },
        status: {
            responseCode: "0",
            errorCode: "",
            errorDesc: ""
        }
    });
};

exports.verifyOTPAndGetDemogDetails = (req, res) => {
    const { mobileNo, passwordValue } = req.body.requestString || {};

    const stored = otpStore[mobileNo];

    if (!stored) {
        return res.status(400).json({
            status: {
                responseCode: "1",
                errorCode: "OTP_NOT_GENERATED",
                errorDesc: "Generate OTP first"
            }
        });
    }

    if (Date.now() > stored.expiresAt) {
        return res.status(401).json({
            status: {
                responseCode: "1",
                errorCode: "OTP_EXPIRED",
                errorDesc: "OTP expired"
            }
        });
    }

    if (passwordValue !== stored.otp) {
        return res.status(401).json({
            status: {
                responseCode: "1",
                errorCode: "INVALID_OTP",
                errorDesc: "Incorrect OTP"
            }
        });
    }

    let customer = customerData.find(c => c.customerMobileNo === mobileNo);

    if (!customer) {
        customer = {
            customerFirstName: "New",
            customerLastName: "Customer",
            customerCity: "Bangalore",
            customerState: "Karnataka",
            customerMobileNo: mobileNo,
            offerAmount: ((Math.floor(Math.random() * 10) + 5) * 100000).toString(),
            tenure: ["12", "24", "36"][Math.floor(Math.random() * 3)],
            rateOfInterest: (8 + Math.random() * 4).toFixed(2) + "%"
        };
    }

    return res.json({
        contextParam: {
            partnerID: "HDFCBANK",
            channelID: "ADOBE",
            productName: "PL"
        },
        responseString: {
            OfferDemogDetails: [customer]
        },
        status: {
            responseCode: "0",
            errorCode: "",
            errorDesc: ""
        }
    });
};

exports.finalSubmission = (req, res) => {
    const { loanAmount, tenure } = req.body.requestString || {};

    if (!loanAmount || !tenure) {
        return res.status(400).json({
            status: {
                responseCode: "1",
                errorCode: "MISSING_FIELDS",
                errorDesc: "Loan amount or tenure missing"
            }
        });
    }

    return res.json({
        contextParam: {
            partnerID: "HDFCBANK",
            channelID: "ADOBE"
        },
        responseString: {
            vkycLink: `https://dummy-vkyc-link.com/session/${Date.now()}`,
            acknowledgementId: "ACK" + Math.floor(Math.random() * 1000000000)
        },
        status: {
            responseCode: "0",
            errorCode: "",
            errorDesc: ""
        }
    });
};