const express = require("express");
const request = require("request");
const svg2img = require("svg2img");
const fs = require("fs");
const router = express.Router();
const walletTransactionController = require("../controllers/walletTransactionController");
const bankAccountController = require("../controllers/bankAccountController");
const userController = require("../controllers/userController");
const middleware = require("../middleware");

const omise = require("omise")({
  secretKey: process.env.OMISE_SECRE_KEY,
  omiseVersion: "2017-11-02",
});

router.post("/events", async (req, res) => {
  if (
    req.body.key === "charge.complete" &&
    req.body.data.status === "successful"
  ) {
    const id = req.body.data.id.split("_")[2];
    const wallet =
      await walletTransactionController.updateWalletTransactionById(
        id,
        "success"
      );
    if (wallet.affectedRows !== 1) return res.json("error");

    const walletInfo =
      await walletTransactionController.getWalletTransactionById(id);
    //Get User Id
    //Add User Balance
    const user = await userController.getUserById(walletInfo[0].user_id);
    const updateState = await userController.updateUserBalance(
      user[0].user_id,
      user[0].wallet_balance + req.body.data.amount / 100
    );
    console.log(updateState);
    if (updateState.affectedRows !== 1) return res.json("error");

    return res.json("success");
  }

  if (req.body.key === "charge.complete" && req.body.data.status === "failed") {
    const id = req.body.data.id.split("_")[2];
    const wallet =
      await walletTransactionController.updateWalletTransactionById(
        id,
        "cancel"
      );
    if (wallet.affectedRows !== 1) return res.json("error");
    return res.json("success");
  }
  return res.json("error");
});

router.post("/create", middleware.verifySessionToken, async (req, res) => {
  const sourceId = req.body.source_id;
  const amount = req.body.amount;
  const currency = req.body.currency;

  omise.charges.create(
    {
      amount: amount,
      currency: currency,
      source: sourceId,
    },
    function (err, resp) {
      if (err) {
        console.log(err);
        const data = {
          status: "error",
        };
        return res.json(data);
      }

      var options = {
        method: "GET",
        url: resp.source.scannable_code.image.download_uri,
        headers: {},
      };

      request(options, async function (error, response) {
        if (error) {
          console.log(err);
          const data = {
            status: "error",
          };
          return res.json(data);
        }

        svg2img(
          response.body,
          { width: 680, height: 970 },
          async function (error, buffer) {
            if (error) {
              const data = {
                status: "error",
              };
              return res.json(data);
            }

            const id = resp.id.split("_")[2];

            fs.writeFileSync(`public/qrcode/${id}.png`, buffer);

            const data = {
              status: "success",
              image_uri: `https://www.gotogetherapp.me/static/qrcode/${id}.png`,
              qr_id: id,
            };

            const wallet = {
              id: id,
              user_id: req.user.user_id,
              amount: amount / 100,
              type: "promptpay",
              action: "deposit",
            };

            await walletTransactionController.addWalletTransaction(wallet);

            return res.json(data);
          }
        );
      });
    }
  );
});

router.post("/check", middleware.verifySessionToken, async (req, res) => {
  const wallet =
    await walletTransactionController.getPendingWalletTransactionByUserId(
      req.user.user_id,
      "promptpay"
    );
  if (wallet.length === 0) {
    const data = {
      status: "ready",
    };
    return res.json(data);
  }

  console.log(wallet);

  omise.charges.retrieve(
    `chrg_test_${wallet[0].wallet_transaction_id}`,
    function (err, resp) {
      if (err) {
        const data = {
          status: "error",
        };
        return res.json(data);
      }

      const id = resp.id.split("_")[2];
      const data = {
        status: "success",
        image_uri: `https://www.gotogetherapp.me/static/qrcode/${id}.png`,
        qr_id: id,
        amount: resp.amount,
        expires: resp.expires_at,
      };
      return res.json(data);
    }
  );
});

router.post("/cancel", middleware.verifySessionToken, async (req, res) => {
  const id = req.body.qrcode_id;
  if (!id) return res.json("error");
  var options = {
    method: "POST",
    url: `https://api.omise.co/charges/chrg_test_${id}/mark_as_failed`,
    headers: {
      Authorization: "Basic c2tleV90ZXN0XzVweGMxMzBqdzd4NDdwZ2UzcDM6",
    },
  };
  request(options, async function (error, response) {
    if (error) return res.json("error");
    const wallet =
      await walletTransactionController.updateWalletTransactionById(
        id,
        "cancel"
      );
    if (wallet.affectedRows !== 1) return res.json("error");
    if (response.body.status !== "failed") return res.json("error");
    return res.json("success");
  });
});

router.post("/addBank", middleware.verifySessionToken, async (req, res) => {
  /*
    user_id: '50467969',
  first_name: 'Tachittanachote',
  last_name: 'Armatmontree',
  phone_number: '0973279939',
  email: 'tctnc79@gmail.com',
  device_id: 'f5549c5b-8ad7-4494-ace4-d31999783777',
  iat: 1637944720,
  exp: 1638031120
     */
  var info = req.body.bankInfo;
  //console.log(info)
  var options = {
    method: "POST",
    url: "https://api.omise.co/recipients",
    headers: {
      Authorization: "Basic c2tleV90ZXN0XzVweGMxMzBqdzd4NDdwZ2UzcDM6",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      name: req.user.first_name + " " + req.user.last_name,
      description: "go customer" + req.user.user_id,
      email: req.user.phone_number + "@mail.com",
      type: "individual",
      tax_id: "1234567890",
      "bank_account[brand]": info.brand,
      "bank_account[number]": info.number,
      "bank_account[name]": info.name,
    },
  };
  request(options, async function (error, response) {
    if (error) return res.json("error");
    //console.log(response.body);
    let values = JSON.parse(response.body);
    await bankAccountController.createBankAccount(
      values.id,
      info.number,
      values.bank_account.brand,
      values.name,
      req.user.user_id
    );
    return res.json("success");
  });
});

router.post("/removeBank", middleware.verifySessionToken, async (req, res) => {
  let bank = await bankAccountController.getBankAccountByUserId(req.user.user_id);
  //console.log(bank[0].recipient_id)
  let recipient = bank[0].recipient_id;
  var options = {
    method: "DELETE",
    url: `https://api.omise.co/recipients/${recipient}`,
    headers: {
      Authorization: "Basic c2tleV90ZXN0XzVweGMxMzBqdzd4NDdwZ2UzcDM6",
    },
  };

  request(options, async function (error, response) {
    if (error) return res.json("error");
    //console.log(response.body);
    //let values = JSON.parse(response.body);
    await bankAccountController.removeBankAccountByUserId(req.user.user_id);
  });
  return res.json("success");
});

module.exports = router;
