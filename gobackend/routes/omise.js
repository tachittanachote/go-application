const express = require("express");
const request = require('request');
const svg2img = require('svg2img');
const fs = require('fs');
const router = express.Router();
const walletTransactionController = require('../controllers/walletTransactionController')
const middleware = require('../middleware')

const omise = require('omise')({
    'secretKey': process.env.OMISE_SECRE_KEY,
    'omiseVersion': '2017-11-02'
});

router.post("/events", async (req, res) => {
    if (req.body.key === 'charge.complete' && req.body.data.status === 'successful') {
        const id = req.body.data.id.split("_")[2];
        const wallet = await walletTransactionController.updateWalletTransactionById(id, "success")
        if (wallet.affectedRows !== 1) return res.json("error")

        //Get User Id
        //Add User Balance

        return res.json("success")
    }
    return res.json("error")
});

router.post("/create", middleware.verifySessionToken, async (req, res) => {

    const sourceId = req.body.source_id;
    const amount = req.body.amount;
    const currency = req.body.currency;

    omise.charges.create({
        'amount': amount,
        'currency': currency,
        'source': sourceId
    }, function (err, resp) {
        if (err) {
            console.log(err)
            const data = {
                status: "error",
            }
            return res.json(data)
        }

        var options = {
            'method': 'GET',
            'url': resp.source.scannable_code.image.download_uri,
            'headers': {
            }
        };

        request(options, async function (error, response) {
            if (error) {
                console.log(err)
                const data = {
                    status: "error",
                }
                return res.json(data)
            }

            svg2img(response.body, { 'width': 680, 'height': 970 }, async function (error, buffer) {
                if (error) {
                    const data = {
                        status: "error",
                    }
                    return res.json(data)
                }

                const id = resp.id.split("_")[2];

                fs.writeFileSync(`public/qrcode/${id}.png`, buffer);

                const data = {
                    status: "success",
                    image_uri: `https://www.gotogetherapp.me/static/qrcode/${id}.png`,
                    qr_id: id
                }

                const wallet = {
                    id: id,
                    user_id: req.user.user_id,
                    amount: amount,
                    type: 'promptpay',
                }

                await walletTransactionController.addWalletTransaction(wallet)

                return res.json(data)
            });



        });


    });
});

router.post('/check', middleware.verifySessionToken, async (req, res) => {
    const wallet = await walletTransactionController.getPendingWalletTransactionByUserId(req.user.user_id, 'promptpay')
    if (wallet.length === 0) {
        const data = {
            status: "ready",
        }
        return res.json(data)
    }

    console.log(wallet)

    omise.charges.retrieve(`chrg_test_${wallet[0].wallet_transaction_id}`, function (err, resp) {
        if (err) {
            const data = {
                status: "error",
            }
            return res.json(data)
        }

        const id = resp.id.split("_")[2];
        const data = {
            status: "success",
            image_uri: `https://www.gotogetherapp.me/static/qrcode/${id}.png`,
            qr_id: id,
            amount: resp.amount,
            expires: resp.expires_at
        }
        return res.json(data)
    });

});

router.post('/cancel', middleware.verifySessionToken, async (req, res) => {
    const id = req.body.qrcode_id;
    if (!id) return res.json("error");
    const wallet = await walletTransactionController.updateWalletTransactionById(id, "cancel")
    if (wallet.affectedRows !== 1) return res.json("error");
    var options = {
        'method': 'POST',
        'url': `https://api.omise.co/charges/${id}/mark_as_failed`,
        'headers': {
            'Authorization': 'Basic c2tleV90ZXN0XzVweGMxMzBqdzd4NDdwZ2UzcDM6'
        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });

    
})


module.exports = router;