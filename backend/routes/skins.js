const express = require('express');
const router = express.Router();
const { Skins } = require('../models');

// Crear un nuevo skin
router.post('/', async (req, res) => {
    try {
        const newSkin = await Skins.create(req.body);
        res.status(201).json(newSkin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todos los skins
router.get('/', async (req, res) => {
    try {
        const skins = await Skins.findAll();
        res.status(200).json(skins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;