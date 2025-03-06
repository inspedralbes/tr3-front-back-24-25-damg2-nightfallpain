const express = require('express');
const router = express.Router();
const Estadistica = require('../modelsmongo/Estadistiques');

// Crear una partida
router.post('/', async (req, res) => {
    try {
        const nuevaEstadistica = await Estadistica.create(req.body);
        res.status(201).json(nuevaEstadistica);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;