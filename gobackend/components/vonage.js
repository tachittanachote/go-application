const Vonage = require('@vonage/server-sdk')
require('dotenv').config();

const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
})

exports.requestOtp = (phoneNumber, message) => {
    console.log("Real otp requested")
    return new Promise((resolve, reject) => {
        vonage.message.sendSms(process.env.APP_NAME, phoneNumber, message, (err, res) => {
            if (err) reject(err);
            resolve(res.messages[0]['status'])
        })
    })
}