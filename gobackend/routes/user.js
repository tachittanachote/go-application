const express = require("express");
const userController = require("../controllers/userController")
const bankAccountController = require("../controllers/bankAccountController")
const router = express.Router();
const users = require("../models/user");

router.post('/', async(req, res) => {
    //RETURN PROFILE
    console.log(req.user.user_id, "User IDDDDD")
    //console.log(req.user)
    var user = await userController.getUserById(req.user.user_id)
    //console.log(user[0],"OK")
    res.json(user[0])
});

router.post('/state', (req, res) => {
    //DRIVING STATE
    //TRAVELING STATE
    //NONE STATE
    //WAITING STAGE
    //PAY STAGE
    //console.log(req.user)
    var userState = users.getUserStateById(req.user.user_id);
    if(userState.length > 0){
        console.log("", userState)
        return res.json(userState);
    }else{
        var user = req.user;
        users.addUser(Object.assign(user, {state: "NONE"}));
        console.log("ID", users.getUser())
        res.json(users.getUserStateById(req.user.user_id));
        return;
    }
});

router.post('/state/update', (req, res) => {
    //DRIVING STATE
    //TRAVELING STATE
    //NONE STATE
    //WAITING STAGE
    //PAY STAGE
    res.json("OK")
});

router.post('/:id', async(req, res) => {
    //RETURN PROFILE
    //console.log(req.user)
    var user = await userController.getUserById(req.user.user_id)
    res.json(user)
});


router.post('/driververify/:id', async (req, res) => {

    if (req.user.user_id === req.params.id) {
        const result = await userController.getVerifyStatusByUserId(req.user.user_id)
        console.log(result)
        res.json({verify_driver: result[0].verify_driver, driver_license_id: result[0].driver_license_id})
    }
    else {
        res.json("Conflict")
    }

})

router.post('/bankcheck/:id', async (req, res) => {

    if (req.user.user_id === req.params.id) {
        const result = await bankAccountController.getBankAccountByUserId(req.user.user_id)
        if(result.length === 0) {
            return res.json("error")
        }else {
            return res.json(result)
        }
    }
    else {
        res.json("Conflict")
    }

})



module.exports = router;