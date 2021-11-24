const db = require("../models/db")

exports.addWalletTransaction = (wallet) => {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO wallet_transactions (wallet_transaction_id, user_id, status, amount, type) VALUES (?, ?, 'pending', ?, ?)`, 
            [
                wallet.id, 
                wallet.user_id, 
                wallet.amount,
                wallet.type,
            ], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.updateWalletTransactionById = (id, status) => {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE wallet_transactions SET status = '?', updated_at = ? WHERE wallet_transaction_id = ?`, [id, status], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}


exports.getWalletTransactionById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM wallet_transactions WHERE wallet_transaction_id = ?`, [id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.getPendingWalletTransactionByUserId = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM wallet_transactions WHERE user_id = ? and status = 'pending'`, [id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}