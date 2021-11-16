const express = require("express");

const otpController = require('../controllers/otpController');
const userController = require('../controllers/userController');

const vonage = require('../components/vonage');
const utils = require('../components/utils');
const token = require('../components/token');

const router = express.Router();

router.post('/request', async (req, res) => {
    var phoneNumber = req.body.phone_number;

    if (!phoneNumber || !utils.validatePhoneNumber(phoneNumber)) return res.json({ status: "error" });

    var countryPrefixNumber = utils.formatPhoneNumber(phoneNumber);
    var referenceCode = utils.randString(4).toUpperCase();
    var otpCode = utils.generateNumbers(6);

    var message = `Your Go App verification code is ${otpCode}.  Please use it within 5 minutes. (Ref: ${referenceCode})`
    var request = await vonage.requestOtp(countryPrefixNumber, message);
    //var request = "0";
    console.log(request, "Otp Status")
    if (request !== "0") return res.json({ status: "error" });

    otpController.getOTPByPhoneNumber(countryPrefixNumber).then((e) => {
        if (e.length === 0) {
            otpController.addOTP(countryPrefixNumber, referenceCode, otpCode, req.device.device_id).then((e) => {
                res.json({ status: "success", ref: referenceCode });
            }).catch((e) => {
                console.log(e)
            })
        }
        else {
            otpController.updateOTP(countryPrefixNumber, referenceCode, otpCode, req.device.device_id).then((e) => {
                res.json({ status: "success", ref: referenceCode });
            }).catch((e) => {
                console.log(e)
            })
        }
    }).catch((e) => {
        console.log(e)
    });


});

router.post('/verify', (req, res) => {
    var deviceId = req.device.device_id;
    var otpCode = req.body.code;
    var referenceCode = req.body.reference_code;

    if (!referenceCode) return res.json({ status: "error" });

    otpController.getOTP(otpCode, referenceCode, deviceId).then((e) => {
        if (e.length === 0) return res.json({ status: "error" });

        var phoneNumber = utils.localPhoneNumberFormatter(e[0].phone_number);
        var accessToken = token.generateAccessToken({ phoneNumber: phoneNumber, deviceId: deviceId });

        otpController.removeOTP(deviceId);
        userController.getUserByPhoneNumber(phoneNumber).then( async (e) => {
            if (e.length !== 0) {
                await userController.updateUserDeviceIdByPhoneNumber(phoneNumber, deviceId);
                res.json({ status: "success", access_token: accessToken });
            }
            else {
                res.json({ status: "success", access_token: accessToken, isNewUser: true });
            }
        }).catch((e) => {
            console.log(e)
        });

    }).catch((e) => {
        console.log(e)
    })
});


module.exports = router;