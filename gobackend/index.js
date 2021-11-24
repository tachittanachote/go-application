//Packages
const express = require("express");
const cors = require('cors');


//Routes
const usersRoute = require("./routes/user");
const otpRoute = require("./routes/otp");
const carsRoute = require("./routes/cars");
const devicesRoute = require("./routes/device");
const authRoute = require("./routes/auth");
const invoiceRoute = require("./routes/invoices");
const locationRoute = require("./routes/location");
const profileRoute = require("./routes/profile");
const emergencyRoute = require("./routes/emergency")
//Middleware
const middleware = require("./middleware");

require("dotenv").config();

const app = express()
const router = express.Router();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use('/api/v1', router);

app.get("/", (req, res) => {
    res.redirect("https://www.google.com");
})

//No middleware require
router.use('/device', devicesRoute)
router.use('/emergency', emergencyRoute)
//Middleware verify token
router.use('/otp', middleware.verifyDevice, otpRoute)

//Middleware access token
router.use('/auth', middleware.verifyAccessToken, authRoute)

//Middleware session token
router.use('/user', middleware.verifySessionToken, usersRoute)
router.use('/cars', middleware.verifySessionToken, carsRoute)
router.use('/location', middleware.verifySessionToken, locationRoute)
router.use('/invoices', middleware.verifySessionToken, invoiceRoute)
router.use('/profile', middleware.verifySessionToken, profileRoute)

app.listen(PORT, () => {
    console.log(`SERVER: listening on 0.0.0.0:${PORT}`)
})

//Test
const test = require("./test")
test.runTest();