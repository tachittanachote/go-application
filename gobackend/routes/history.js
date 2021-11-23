const express = require("express");
const router = express.Router();

const historyController = require('../controllers/historyController');
const feedbackController = require('../controllers/feedbackController');

const car = require("../models/car");
const passengers = require("../models/passenger");
const users = require("../models/user");


router.post("/", async(req, res) => {
    var user = req.body.user;
    try{
        let histories  = await historyController.getHistoryByUserId(user.id);
        //console.log(histories)
        res.json(histories);
    }catch(e){
        console.log(e)
        res.json("error")
    }
    
    
});

router.post("/create", async (req, res) => {
    var driverId = req.body.carId;
    var user = req.body.user;
    var info = req.body.info;
    //userId, driverId, origin, destination, distance, status
    var origin = String(info.origin.lat).concat(', ', String(info.origin.long))
    console.log(driverId, user, info)
    try{
        //console.log(origin)
        let history  = await historyController.createHistory(user.id, driverId, origin, 'progress', user.type)
        //console.log("history suscess!")
        console.log(user.type)
        if(user.type === 'passenger'){
            let feedback = await feedbackController.createFeedback(history.insertId, 'pending')
        }

        return res.json("success");

    }catch{
        //console.log("history error!")
        return res.json("error");
    }
    //res.json(history);
});

router.post("/update", async (req, res) => {
    var driverId = req.body.carId;
    var user = req.body.user;
    var info = req.body.info;
    var destination = String(info.destination.lat).concat(', ', String(info.destination.long))
    var distance = info.distance
    try{
        //console.log(destination)
        let history  = await historyController.updateHistory(user.id, driverId, destination, distance, 'done')
        //console.log(history)
        return res.json("success");

    }catch{
        return res.json("error");
    }

});



module.exports = router;