const db = require("../models/db")
const moment = require("moment");

exports.addFavoritePath = (data) => {

    var now = moment().format("YYYY-MM-DD hh:mm:ss");

    return new Promise((resolve, reject) => {
        db.query(`insert into favorite_path(name, origin, destination, user_id, created_at, updated_at) values(?, ?, ?, ?, ?, ?)`,
            [
                data.name,
                data.origin,
                data.destination,
                data.user_id,
                now,
                now,
            ], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
    });
}

exports.getFavoriteByUserId = (user_id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM favorite_path WHERE user_id = ?`,
            [
                user_id,
            ], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
    });
}

exports.removeFavoriteById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM favorite_path WHERE id = ?`,
            [
                user_id,
            ], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
    });
}