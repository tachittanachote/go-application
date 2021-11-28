const express = require("express");

const userController = require("../controllers/userController");
const utils = require("../components/utils");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

const refreshTokens = [];

router.get("/", (req, res) => {
  //res.sendFile(__dirname + '/views/index.html');
});

router.post("/login", async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  console.log(username + password);
  let check = await userController.checkAdmin(username);
  if (check.length > 0) {
    //console.log(check)
    //console.log(check[0].username)
    if (check[0].password === password) {

      let jwtToken = jwt.sign({ 
          user: check[0].username
        },
        process.env.SESSION_TOKEN_SECRET,
        {
          expiresIn: "24h",
        }
      );
      // save user token
      await userController.updateAdminToken(username, jwtToken)
      let data = {
          token:jwtToken
      }
      res.status(200).json(data);

      //res.json("success")
    } else {
      res.json("error");
    }
  } else {
    res.json("error");
  }
});

router.post("/getDrivers", async (req, res) => {
    var token = req.body.token;
    var user = req.body.user;
    console.log(user)
    let check = await userController.checkTokenAdmin(user);
    //console.log(check[0].token)
    if(check[0].token === token){
        let data = await userController.getDriverNotVerify();
        console.log(data)
        res.status(200).json(data);
    }else{
        res.json("error")
    }
});

router.post("/activeDriver", async (req, res) => {
    var token = req.body.token;
    var user = req.body.user;
    var driver = req.body.driver;
    //console.log(user)
    let check = await userController.checkTokenAdmin(user);
    console.log(check[0].token)
    console.log(token)
    if(check[0].token === token){
        let data = await userController.updateVerifyDriver(driver.id);
        console.log(data)
        res.status(200).json("success");
    }else{
        res.json("error")
    }
});


module.exports = router;
