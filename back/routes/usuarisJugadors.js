const express = require('express');
const router = express.Router();
const { UsuarisJugadors } = require('../models');

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    try {
        const newUser = await UsuarisJugadors.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await UsuarisJugadors.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;