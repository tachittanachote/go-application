const db = require("../models/db")
const moment = require("moment")
const { nanoid } = require("nanoid");

const ADD_OTP_STATEMENT = "INSERT INTO otp (otp_id, phone_number, ref_token, otp_code, device_id, created_at, updated_at) VALUES ?";
const GET_OTP_STATEMENT = 'SELECT * FROM otp WHERE otp_code = ? AND ref_token = ? AND device_id = ?';
const GET_OTP_BY_PHONENUMBER_STATEMENT = 'SELECT * FROM otp WHERE phone_number = ?';
const REMOVE_OTP_STATEMENT = "DELETE FROM otp WHERE device_id = ?";
const UPDATE_OTP_STATEMENT = 'UPDATE otp SET otp_id = ?, ref_token = ?, otp_code = ?, device_id = ?, updated_at = ? WHERE phone_number = ?'

exports.addOTP = (phoneNumber, refToken, otpCode, deviceId) => {

    var now = moment().format("YYYY-MM-DD hh:mm:ss");
    var values = [[
        nanoid(),
        phoneNumber,
        refToken,
        otpCode,
        deviceId,
        now,
        now
    ]];

    return new Promise((resolve, reject) => {
        db.query(ADD_OTP_STATEMENT, [values], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.getOTP = (otpCode, refToken, deviceId) => {
    return new Promise((resolve, reject) => {
        db.query(GET_OTP_STATEMENT, [otpCode, refToken, deviceId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

exports.removeOTP = (deviceId) => {
    return new Promise((resolve, reject) => {
        db.query(REMOVE_OTP_STATEMENT, [deviceId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

exports.getOTPByPhoneNumber = (phoneNumber) => {
    return new Promise((resolve, reject) => {
        db.query(GET_OTP_BY_PHONENUMBER_STATEMENT, [phoneNumber], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.updateOTP = (phoneNumber, refToken, otpCode, deviceId) => {

    var now = moment().format("YYYY-MM-DD hh:mm:ss");
    var values = [
        nanoid(), 
        refToken, 
        otpCode, 
        deviceId,
        now, 
        phoneNumber
    ];

    return new Promise((resolve, reject) => {
        db.query(UPDATE_OTP_STATEMENT, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}