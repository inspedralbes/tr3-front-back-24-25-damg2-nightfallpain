const express = require('express');
const router = express.Router();
const Estadistica = require('../modelsmongo/Estadistiques');


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
router.post('/', async (req, res) => {
    try {
        const nuevaEstadistica = await Estadistica.create(req.body);
        res.status(201).json(nuevaEstadistica);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;