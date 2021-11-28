const db = require("../models/db")
const moment = require("moment")
//
const ADD_HISTORY = "INSERT INTO history (user_id, driver_user_id, origin, status, type, created_at, updated_at) VALUES ?";
const GET_HISTORY_BY_USER_ID = 'SELECT * FROM history WHERE user_id = ?';
const UPDATE_HISTORY_BY_USER_ID = 'UPDATE history SET destination = ?, distance = ?, status = ?, updated_at = ? WHERE user_id = ? AND driver_user_id = ? AND destination IS NULL AND distance IS NULL'
const GET_LAST_HISTORY_BY_USER_ID = 'SELECT * FROM history WHERE user_id = ? ORDER BY history_id DESC LIMIT 1';

exports.createHistory = (userId, driverId, origin, status, type) => {
    var now = moment().format("YYYY-MM-DD hh:mm:ss");
    var values = [[
        userId, 
        driverId, 
        origin, 
        //destination, 
        //distance,
        status,
        type,
        now,
        now
    ]];
    //console.log(values)
    return new Promise((resolve, reject) => {
        db.query(ADD_HISTORY, [values], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.updateHistory = (userId, driverId, destination, distance, status) => {
    var now = moment().format("YYYY-MM-DD hh:mm:ss");
    var values = [
        destination, 
        distance,
        status,
        now,
        userId, 
        driverId
    ];
    //console.log(values)
    return new Promise((resolve, reject) => {
        db.query(UPDATE_HISTORY_BY_USER_ID, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.getHistoryByUserId = (uid) => {
    return new Promise((resolve, reject) => {
        db.query(GET_HISTORY_BY_USER_ID, [uid], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.getLastHistoryByUserId = (uid) => {
    return new Promise((resolve, reject) => {
        db.query(GET_LAST_HISTORY_BY_USER_ID, [uid], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}
