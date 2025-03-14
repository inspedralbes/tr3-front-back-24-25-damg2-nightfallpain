const express = require('express');
const router = express.Router();
const { Enemics } = require('../models');

// Crear un nuevo enemigo
router.post('/', async (req, res) => {
    try {
        const newEnemic = await Enemics.create(req.body);
        res.status(201).json(newEnemic);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todos los enemigos
router.get('/', async (req, res) => {
    try {
        const enemics = await Enemics.findAll();
        res.status(200).json(enemics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;