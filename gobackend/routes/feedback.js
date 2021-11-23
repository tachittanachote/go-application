const express = require("express");
const router = express.Router();

const historyController = require('../controllers/historyController');
const feedbackController = require('../controllers/feedbackController');

const car = require("../models/car");
const passengers = require("../models/passenger");
const users = require("../models/user");


router.post("/", async(req, res) => {
    var history = req.body.history;
    console.log(history.id)
    try{
        let feedback = await feedbackController.getFeedbackByHistoryId(history.id)
        console.log(feedback)
        res.json(feedback);
    }catch(e){
        console.log(e)
        res.json("error")
    }
    
    
});


router.post("/update", async (req, res) => {
    var history = req.body.history;
    var feedback = req.body.feedback;
    let star = 0;
    if(feedback.star != 0){
        star=feedback.stars;
    }
    try{
        let update  = await feedbackController.updateFeedbackById(feedback.id, star, feedback.comment, 'done')
        return res.json("success");

    }catch{
        return res.json("error");
    }

});



module.exports = router;