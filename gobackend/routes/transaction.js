const express = require("express");
const router = express.Router();

const userController = require('../controllers/userController');
const transactionController = require('../controllers/transactionController');
const historyController = require('../controllers/historyController');

const car = require("../models/car");
const passengers = require("../models/passenger");
const users = require("../models/user");


router.post("/", async(req, res) => {
    var history = req.body.history;
    try{
        let transactions  = await transactionController.getTransactionByHistoryId(history.id);
        //console.log(histories)
        res.json(transactions);
    }catch(e){
        console.log(e)
        res.json("error")
    }
    
    
});

router.post("/create", async (req, res) => {
    var history = req.body.history;
    var info = req.body.payInfo;

    console.log("history", history)
    console.log("info", info)

    try{
        let transaction  = await transactionController.createTransaction(0, info.type, 'pending', history.id)
        
        return res.json("success");

    }catch{
        //console.log("history error!")
        return res.json("error");
    }
    //res.json(history);
});

router.post("/update", async (req, res) => {
    var passenger = req.body.passenger;
    var info = req.body.payInfo;
    var driverInfo = req.body.driver;
    //console.log(info)
    try{
        let history = await historyController.getLastHistoryByUserId(passenger.id)
        let transaction = await transactionController.getTransactionByHistoryId(history[0].history_id)
        let updateTransaction = await transactionController.updateTransactionByHistoryId(history[0].history_id, info.amount, 'success')
        //console.log(transaction[0].type)
        console.log(updateTransaction)

        let user = await userController.getUserById(passenger.id)
        let driver = await userController.getUserById(driverInfo.id)
        if(transaction[0].type === 'wallet'){
            console.log('wallet paid')
            let passengerUpdateBalance = (user[0].wallet_balance) - (info.amount)
            let driverUpdateBalance = (driver[0].wallet_balance) + (info.amount)
            //console.log(passengerUpdateBalance)
            let updateD = await userController.updateUserBalance(driverInfo.id, driverUpdateBalance)
            let updateP = await userController.updateUserBalance(passenger.id, passengerUpdateBalance)
        }else{
            console.log('cash paid')
        }

        return res.json("success");
    }catch{
        return res.json("error");
    }

});



module.exports = router;