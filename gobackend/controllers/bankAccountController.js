const db = require("../models/db")
const moment = require("moment")
//INSERT INTO `bank_accounts`(`bank_account_id`, `recipient_id`, `bank_account_number`, `bank_name`, `bank_holder`, `user_id`, `created_at`, 
const ADD_BANK_ACCOUNT = "INSERT INTO bank_accounts (recipient_id, bank_account_number, bank_name, bank_holder, user_id, created_at, updated_at) VALUES ?";
const GET_BANK_ACCOUNT_BY_USER_ID = 'SELECT * FROM bank_accounts WHERE user_id = ?';
//const UPDATE_BANK_ACCOUNT_BY_USER_ID = 'UPDATE bank_accounts SET destination = ?, distance = ?, status = ?, updated_at = ? WHERE user_id = ? AND driver_user_id = ? AND destination IS NULL AND distance IS NULL'
//DELETE FROM `bank_accounts` WHERE
const REMOVE_BANK_ACCOUNT = 'DELETE FROM bank_accounts WHERE user_id = ?';

exports.createBankAccount = (recipient_id, bank_account_number, bank_name, bank_holder, user_id) => {
    var now = moment().format("YYYY-MM-DD hh:mm:ss");
    var values = [[
        recipient_id, 
        bank_account_number, 
        bank_name, 
        bank_holder, 
        user_id,
        now,
        now
    ]];
    //console.log(values)
    return new Promise((resolve, reject) => {
        db.query(ADD_BANK_ACCOUNT, [values], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}



exports.getBankAccountByUserId = (uid) => {
    return new Promise((resolve, reject) => {
        db.query(GET_BANK_ACCOUNT_BY_USER_ID, [uid], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.removeBankAccountByUserId = (uid) => {
    return new Promise((resolve, reject) => {
        db.query(REMOVE_BANK_ACCOUNT, [uid], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}


