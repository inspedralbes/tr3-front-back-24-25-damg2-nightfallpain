const express = require('express');
const router = express.Router();
const { Shop } = require('../models');

// GET /shop
router.get('/', async (req, res) => {
    try {
        const shop = await Shop.findAll();
        res.json(shop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'There was a problem trying to get the shop' });
    }
});


// POST /shop
router.post('/', async (req, res) => {
    try {
        const shop = await Shop.create(req.body);
        res.json(shop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'There was a problem trying to create the shop' });
    }
});


module.exports = router;