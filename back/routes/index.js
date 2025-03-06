const express = require('express');
const router = express.Router();

// Rutas de MongoDB
router.use('/partida', require('./partida'));
router.use('/estadistiques', require('./estadistiques'));

// Rutas de SQL
router.use('/usuaris-jugadors', require('./usuarisJugadors'));
router.use('/armes', require('./armes'));
router.use('/skins', require('./skins'));
router.use('/enemics', require('./enemics'));

module.exports = router;