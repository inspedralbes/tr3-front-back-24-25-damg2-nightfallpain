const express = require('express');
const conectarDB = require('./config/db');
const Partida = require('./models/Partida');
const Estadistiques = require('./models/Estadistiques');

const app = express();
app.use(express.json());

// Conectar a MongoDB
conectarDB();

// Ruta para crear una partida
app.post('/api/partida', async (req, res) => {
    try {
        const nuevaPartida = await Partida.create(req.body);
        res.status(201).json(nuevaPartida);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para crear estadísticas
app.post('/api/estadistiques', async (req, res) => {
    try {
        const nuevaEstadistica = await Estadistiques.create(req.body);
        res.status(201).json(nuevaEstadistica);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
