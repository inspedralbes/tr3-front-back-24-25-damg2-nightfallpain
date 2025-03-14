const express = require('express');
const router = express.Router();
const Partida = require('../modelsmongo/Partida');

// Crear una partida
router.post('/', async (req, res) => {
    try {
        const nuevaPartida = await Partida.create(req.body);
        res.status(201).json(nuevaPartida);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;