const db = require("../models/db")
const moment = require("moment")
//
const ADD_TRANSACTION = "INSERT INTO transaction (money_amount, type, status, travel_history_id, created_at, updated_at) VALUES ?";
const GET_TRANSACTION_BY_TRAVEL_HISTORY_ID = 'SELECT * FROM transaction WHERE travel_history_id = ?';
const UPDATE_TRANSACTION_BY_ID = 'UPDATE transaction SET money_amount = ?, status = ?, updated_at = ? WHERE transaction_id = ? '
const UPDATE_TRANSACTION_BY_TRAVEL_HISTORY_ID = 'UPDATE transaction SET money_amount = ?, status = ?, updated_at = ? WHERE travel_history_id = ?'

exports.createTransaction = (money_amount, type, status, travel_history_id) => {
    var now = moment().format("YYYY-MM-DD hh:mm:ss");
    var values = [[
        money_amount,
        type,
        status,
        travel_history_id, 
        now,
        now
    ]];
    console.log(values)
    return new Promise((resolve, reject) => {
        db.query(ADD_TRANSACTION, [values], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.updateTransaction = (id, moneyAmount, status) => {
    var now = moment().format("YYYY-MM-DD hh:mm:ss");
    var values = [
        moneyAmount,
        status,
        now,
        id
    ];
    //console.log(values)
    return new Promise((resolve, reject) => {
        db.query(UPDATE_TRANSACTION_BY_ID, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.updateTransactionByHistoryId = (hid, moneyAmount, status) => {
    var now = moment().format("YYYY-MM-DD hh:mm:ss");
    var values = [
        moneyAmount,
        status,
        now,
        hid
    ];
    //console.log(values)
    return new Promise((resolve, reject) => {
        db.query(UPDATE_TRANSACTION_BY_TRAVEL_HISTORY_ID, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.getTransactionByHistoryId = (thid) => {
    return new Promise((resolve, reject) => {
        db.query(GET_TRANSACTION_BY_TRAVEL_HISTORY_ID, [thid], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}


