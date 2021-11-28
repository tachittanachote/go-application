const db = require("../models/db")
const generateUniqueId = require("generate-unique-id");
const moment = require("moment");

const ADD_USER_STATEMENT = "INSERT INTO users (user_id, email, first_name, last_name, phone_number, device_id, created_at, updated_at) VALUES ?";
const GET_USER_STATEMENT = "SELECT * FROM users WHERE user_id = ? "
const GET_USER_STATEMENT_BY_PHONE_NUMBER = "SELECT * FROM users WHERE phone_number = ?"
const GET_USER_STATEMENT_BY_PHONE_NUMBER_AND_DEVICE_ID = "SELECT * FROM users WHERE phone_number = ? and device_id = ?"
const UPDATE_USER_STATEMENT_BY_PHONE_NUMBER = "UPDATE users SET device_id = ? WHERE phone_number = ?"
const UPDATE_USER_INFORMATION_BY_USER_ID = "UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, gender = ?, date_of_birth = ?, emergency_phone_number = ?, license_plate = ?, brand = ?, model = ?, color = ?, driver_license_id = ?, citizen_id = ?  WHERE user_id = ? "
const UPDATE_USER_BALANCE_STATEMENT_BY_USER_ID = "UPDATE users SET wallet_balance = ? WHERE user_id = ?"
const CHECK_ADMIN = "SELECT * FROM admin WHERE username = ? "
const UPDATE_ADMIN_TOKEN = "UPDATE admin SET token = ? WHERE username = ? "
const CHECK_TOKEN_ADMIN = "SELECT token FROM admin WHERE username = ? "

const GET_USERS_WAIT_VERIFY = "SELECT user_id, first_name, last_name ,driver_license_id, driver_license_expired_date FROM users WHERE driver_license_id IS NOT NULL AND (verify_driver != ? OR verify_driver IS NULL)"
const VERIFY_DRIVER_USER_BY_ID = "UPDATE users SET verify_driver = ? WHERE user_id = ? "

exports.updateVerifyDriver = (uid) => {
    return new Promise((resolve, reject) => {
        db.query(VERIFY_DRIVER_USER_BY_ID, ['verified', uid], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

exports.getDriverNotVerify = () => {
    return new Promise((resolve, reject) => {
        db.query(GET_USERS_WAIT_VERIFY, 'verified', (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}


exports.checkAdmin = (username) => {
    return new Promise((resolve, reject) => {
        db.query(CHECK_ADMIN, [username], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

exports.checkTokenAdmin = (username) => {
    return new Promise((resolve, reject) => {
        db.query(CHECK_TOKEN_ADMIN, [username], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

exports.updateAdminToken = (username, token) => {
    return new Promise((resolve, reject) => {
        db.query(UPDATE_ADMIN_TOKEN, [token, username], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}



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
            user.license_plate, user.brand, user.model, user.color, user.driver_license_id, user.citizen_id, user.user_id ], (err, res) => {
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
        db.query('SELECT verify_driver, driver_license_id FROM users WHERE user_id = ?', [userId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}