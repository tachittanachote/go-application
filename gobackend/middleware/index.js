const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyDevice = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.DEVICE_TOKEN_SECRET, (err, device) => {
        if (err) return res.sendStatus(403)
        req.device = device
        //console.log(device)
        next()
    })
}

exports.verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization']

    console.log(authHeader, "register headers")

    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
        if (err) return res.sendStatus(403)
        req.access_token = token
        //console.log(token)
        next()
    })
}

exports.verifySessionToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    //console.log(token, "Tokennnn")

    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.SESSION_TOKEN_SECRET, (err, token) => {
        if (err) return res.sendStatus(403)
        req.user = token
        //console.log(token)
        next()
    })
   //next()
}