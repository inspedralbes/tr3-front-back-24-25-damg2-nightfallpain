const express = require('express');
const router = express.Router();
const { Armes } = require('../models');

// Crear un nuevo arma
router.post('/', async (req, res) => {
    try {
        const newArma = await Armes.create(req.body);
        res.status(201).json(newArma);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todas las armas
router.get('/', async (req, res) => {
    try {
        const armas = await Armes.findAll();
        res.status(200).json(armas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;