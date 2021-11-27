const db = require("../models/db")
const generateUniqueId = require("generate-unique-id");
const moment = require("moment");

const ADD_USER_STATEMENT = "INSERT INTO users (user_id, email, first_name, last_name, phone_number, device_id, created_at, updated_at) VALUES ?";
const GET_USER_STATEMENT = "SELECT * FROM users WHERE user_id = ? "
const GET_USER_STATEMENT_BY_PHONE_NUMBER = "SELECT * FROM users WHERE phone_number = ?"
const GET_USER_STATEMENT_BY_PHONE_NUMBER_AND_DEVICE_ID = "SELECT * FROM users WHERE phone_number = ? and device_id = ?"
const UPDATE_USER_STATEMENT_BY_PHONE_NUMBER = "UPDATE users SET device_id = ? WHERE phone_number = ?"
const UPDATE_USER_BALANCE_STATEMENT_BY_USER_ID = "UPDATE users SET wallet_balance = ? WHERE user_id = ?"
const UPDATE_USER_INFORMATION_BY_USER_ID = "UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, gender = ?, date_of_birth = ?, emergency_phone_number = ?, license_plate = ?, brand = ?, model = ?, color = ?  WHERE user_id = ? "

exports.addUser = (user) => {
    const id = generateUniqueId({
        length: 8,
        useLetters: false
    });
    const now = moment().format("YYYY-MM-DD hh:mm:ss");
    return new Promise((resolve) => {
        var values = [
            [
                id,
                user.email,
                user.first_name,
                user.last_name,
                user.phone_number,
                user.device_id,
                now,
                now,
            ],
        ];
        db.query(ADD_USER_STATEMENT, [values], (err, res) => {
            if (err) resolve(err);
            resolve(res);
        });
    });
}

exports.getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        db.query(GET_USER_STATEMENT, [userId], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

exports.getUserByPhoneNumber = (phoneNumber) => {
    return new Promise((resolve, reject) => {
        db.query(GET_USER_STATEMENT_BY_PHONE_NUMBER, [phoneNumber], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

exports.getUserByPhoneNumberAndDeviceId = (phoneNumber, deviceId) => {
    return new Promise((resolve, reject) => {
        db.query(GET_USER_STATEMENT_BY_PHONE_NUMBER_AND_DEVICE_ID, [phoneNumber, deviceId], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

exports.updateUserDeviceIdByPhoneNumber = (phoneNumber, deviceId) => {
    return new Promise((resolve, reject) => {
        db.query(UPDATE_USER_STATEMENT_BY_PHONE_NUMBER, [deviceId, phoneNumber], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}


exports.updateUserInfomationByUserId = (user) => {
    return new Promise((resolve, reject) => {
        db.query(UPDATE_USER_INFORMATION_BY_USER_ID, [user.first_name, user.last_name, user.email, user.phone_number, user.gender, user.date_of_birth, user.emergency_phone_number, 
            user.license_plate, user.brand, user.model, user.color, user.user_id ], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

exports.updateUserBalance = (userId, balance) => {
    return new Promise((resolve, reject) => {
        db.query(UPDATE_USER_BALANCE_STATEMENT_BY_USER_ID, [balance, userId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.getVerifyStatusByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT verify_driver FROM users WHERE user_id = ?', [userId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}