const express = require('express');
const router = express.Router();
const Partida = require('../modelsmongo/Partida');


// Estado de mantenimiento para usuarios
let maintenanceMode = false;

// Middleware de mantenimiento
const maintenanceMiddleware = (req, res, next) => {
    if (maintenanceMode) {
        return res.status(503).json({ 
            message: 'Servicio en mantenimiento', 
            maintenance: true 
        });
    }
    next();
};

// Rutas de control de mantenimiento
router.post('/maintenance/toggle', (req, res) => {
    maintenanceMode = !maintenanceMode;
    res.json({ 
        message: `Modo mantenimiento ${maintenanceMode ? 'activado' : 'desactivado'}`, 
        maintenance: maintenanceMode 
    });
});

router.get('/maintenance/status', (req, res) => {
    res.json({ maintenance: maintenanceMode });
});

// Aplicar middleware a todas las rutas
router.use(maintenanceMiddleware);
// Crear una partida
router.post('/create', async (req, res) => {
    try {
        const { usuari_id } = req.body;
        
        if (!usuari_id) {
            return res.status(400).json({ error: 'Se requiere el ID del usuario' });
        }
        
        // Creamos la partida (siempre en modo singleplayer)
        const nuevaPartida = new Partida({
            usuari_id,
            tipus_partida: 'singleplayer'
        });
        
        const partidaGuardada = await nuevaPartida.save();
        
        res.status(201).json({
            success: true,
            message: 'Partida creada correctamente',
            partida: partidaGuardada
        });
    } catch (error) {
        console.error('Error al crear partida:', error);
        res.status(500).json({ error: 'Error al crear la partida' });
    }
});
router.get('/all', async (req, res) => {
    try {
        const partidas = await Partida.find().select('-__v'); // Excluye el campo __v
        res.status(200).json(partidas);
    } catch (error) {
        console.error('Error al obtener partidas:', error);
        res.status(500).json({ error: 'Error al obtener las partidas' });
    }
});


module.exports = router;