const express = require("express");

const userController = require("../controllers/userController");
const utils = require("../components/utils");
const token = require("../components/token");

const router = express.Router();

const refreshTokens = [];

router.post('/register', async (req, res) => {
    var user = req.body.user;
    if (!utils.validatePhoneNumber(user.phone_number) || !utils.validateEmail(user.email)) return res.json({ status: "error" });
    var userInfo = await userController.getUserByPhoneNumber(user.phone_number);
    if (userInfo.length !== 0) return res.json({ status: "error" });
    userController.addUser(user).then(async (e) => {
        if (e.affectedRows !== 1) return res.json({ status: "error" });
        var userInfo = await userController.getUserByPhoneNumber(user.phone_number);
        var data = {
            user_id: userInfo[0].user_id,
            first_name: userInfo[0].first_name,
            last_name: userInfo[0].last_name,
            phone_number: userInfo[0].phone_number,
            email: userInfo[0].email,
            device_id: userInfo[0].device_id,
        }
        var sessionToken = token.generateSessionToken(data);
        var refreshToken = utils.randString(16);

        refreshTokens[refreshToken] = userInfo[0].user_id;
        res.json({ status: "success", session_token: sessionToken, refresh_token: refreshToken });

    }).catch((e) => {
        console.log(e)
    });
});

router.post('/login', (req, res) => {
    var phoneNumber = req.access_token.phone_number;
    var deviceId = req.access_token.device_id;

    userController.getUserByPhoneNumberAndDeviceId(phoneNumber, deviceId).then((e) => {
        if(e.length === 0) return res.json({ status: "error" });
        var data = {
            user_id: e[0].user_id,
            first_name: e[0].first_name,
            last_name: e[0].last_name,
            phone_number: e[0].phone_number,
            email: e[0].email,
            device_id: e[0].device_id,
        }
        var sessionToken = token.generateSessionToken(data);
        var refreshToken = utils.randString(16);

        refreshTokens[refreshToken] = e[0].user_id;
        res.json({ status: "success", session_token: sessionToken, refresh_token: refreshToken });
    }).catch((e) => {
        console.log(e)
    })

});

router.post('/refreshtoken', (req, res) => {
    //renew session token
});

module.exports = router;