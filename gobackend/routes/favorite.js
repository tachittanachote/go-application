const express = require("express");
const router = express.Router();

const favoriteController = require('../controllers/favoriteController')

router.post('/', async (req, res) => {
    const favr = await favoriteController.getFavoriteByUserId(req.user.user_id);
    res.json(favr);
});

router.post('/add', async (req, res) => {
    const name = req.body.name;
    const destination = req.body.destination;

    const favrData = {
        name: name,
        origin: 'mars',
        destination: destination.lat + "," + destination.lng,
        user_id: req.user.user_id,
    }

    const favr = await favoriteController.addFavoritePath(favrData);

    res.json("OK");
});

router.post('/remove', async (req, res) => {
    const id = req.body.id;
    const favr = await favoriteController.removeFavoriteById(id);

    res.json("OK");
});


module.exports = router;