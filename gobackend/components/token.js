const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.generateDeviceToken = (deviceId) => {
    return jwt.sign({ device_id: deviceId }, process.env.DEVICE_TOKEN_SECRET, { expiresIn: "30m" });
}

exports.generateAccessToken = (device) => {
    return jwt.sign({ phone_number: device.phoneNumber, device_id: device.deviceId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
}

exports.generateSessionToken = (user) => {
    return jwt.sign(user, process.env.SESSION_TOKEN_SECRET, { expiresIn: "24h" });
}