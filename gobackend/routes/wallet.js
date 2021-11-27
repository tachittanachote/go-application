const express = require("express");
const walletTransactionController = require("../controllers/walletTransactionController")
const router = express.Router();
const users = require("../models/user");


router.post('/', async(req, res) => {
    var user = req.body.user;
    var wallet_transaction = await walletTransactionController.getWalletTransactionByUserId(user.id)
    console.log(wallet_transaction)
    res.json(wallet_transaction)
});



module.exports = router;