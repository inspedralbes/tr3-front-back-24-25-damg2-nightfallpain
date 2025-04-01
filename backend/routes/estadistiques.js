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

// Aplicar middleware a todas las rutas
router.use(maintenanceMiddleware);

// 📌 **Ruta para recibir estadísticas desde Unity**
// Backend: actualizar la ruta para guardar estadísticas
// Backend: ruta actualizada para guardar estadísticas con score
router.post('/guardarEstadisticas', async (req, res) => {
    try {
        const { usuari_id, temps, puntuacio } = req.body;

        // Validación modificada para incluir puntuacio
        if (!usuari_id || temps === undefined || temps === null || temps < 0 || 
            puntuacio === undefined || puntuacio === null || puntuacio < 0) {
            return res.status(400).json({ 
                error: "Datos inválidos",
                details: {
                    usuari_id: usuari_id ? "OK" : "Falta usuari_id",
                    temps: (temps !== undefined && temps !== null) 
                        ? (temps >= 0 ? "OK" : "El tiempo no puede ser negativo") 
                        : "Falta tiempo",
                    puntuacio: (puntuacio !== undefined && puntuacio !== null)
                        ? (puntuacio >= 0 ? "OK" : "El score no puede ser negativo")
                        : "Falta puntuación"
                }
            });
        }

        // Aseguramos que los valores son números
        const tiempoNumerico = Number(temps);
        const puntuacionNumerica = Number(puntuacio);

        const nuevaEstadistica = new Estadistica({ 
            usuari_id, 
            temps: tiempoNumerico,
            puntuacio: puntuacionNumerica
        });
        
        await nuevaEstadistica.save();

        res.status(201).json({ 
            message: "Estadísticas guardadas correctamente",
            data: {
                usuari_id,
                temps: tiempoNumerico,
                puntuacio: puntuacionNumerica
            }
        });
    } catch (error) {
        console.error("Error al guardar estadísticas:", error);
        res.status(500).json({ 
            error: "Error interno del servidor",
            details: error.message 
        });
    }
});


module.exports = router;
