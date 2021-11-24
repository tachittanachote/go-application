const db = require("../models/db")
const moment = require("moment")
//
const ADD_FEEDBACK = "INSERT INTO feedback (travel_history_id, status, created_at, updated_at) VALUES ?";
const GET_FEEDBACK_BY_TRAVEL_HISTORY_ID = 'SELECT * FROM feedback WHERE travel_history_id = ?';
const UPDATE_FEEDBACK_TRAVEL_HISTORY_ID = 'UPDATE feedback SET star_number = ?, comment = ?, status = ?, updated_at = ? WHERE travel_history_id = ?'
const UPDATE_FEEDBACK_BY_ID = 'UPDATE feedback SET star_number = ?, comment = ?, status = ?, updated_at = ? WHERE feedback_id = ?'

exports.createFeedback = (travel_history_id, status) => {
    var now = moment().format("YYYY-MM-DD hh:mm:ss");
    var values = [[
        travel_history_id, 
        //star_number, 
        //comment,
        status,
        now,
        now
    ]];
    console.log(values)
    return new Promise((resolve, reject) => {
        db.query(ADD_FEEDBACK, [values], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.updateFeedbackById = (id, star_number, comment, status) => {
    var now = moment().format("YYYY-MM-DD hh:mm:ss");
    var values = [
        star_number, 
        comment,
        status,
        now,
        id
    ];
    //console.log(values)
    return new Promise((resolve, reject) => {
        db.query(UPDATE_FEEDBACK_BY_ID, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.updateFeedbackByHistoryId = (star_number, comment, status, travel_history_id) => {
    var now = moment().format("YYYY-MM-DD hh:mm:ss");
    var values = [
        star_number, 
        comment,
        status,
        now,
        travel_history_id
    ];
    //console.log(values)
    return new Promise((resolve, reject) => {
        db.query(UPDATE_FEEDBACK_TRAVEL_HISTORY_ID, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.getFeedbackByHistoryId = (thid) => {
    return new Promise((resolve, reject) => {
        db.query(GET_FEEDBACK_BY_TRAVEL_HISTORY_ID, [thid], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}


