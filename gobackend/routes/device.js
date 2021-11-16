const express = require("express");
const uuid = require('uuid');

const token = require("../components/token");

const router = express.Router();

router.post('/check', (req, res) => {
    var deviceId = uuid.v4();
    var deviceToken = token.generateDeviceToken(deviceId);
    res.json({ device_id: deviceId, device_token: deviceToken});
});

module.exports = router;