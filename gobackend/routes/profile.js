const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")
const moment = require("moment")

router.post("/update", async(req, res) => {
   console.log(req.body)
   var user = req.body.user;
   var userState = await userController.updateUserInfomationByUserId(user)
   if(userState.affectedRows!==1)return res.json("error")
   return res.json("success")
  });

router.post("/", async(req, res) => {
    //console.log(req.body)
    var user_id = req.body.user.user_id;
    var userProfile = await userController.getUserById(user_id.toString())
    var data = {
      date_of_birth: moment(userProfile[0].date_of_birth).format("YYYY-MM-DD")
    }
    Object.assign(userProfile[0], data)
    res.json(userProfile[0])
   });

module.exports = router;