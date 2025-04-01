const express = require('express');
const router = express.Router();
const Estadistica = require('../modelsmongo/Estadistiques');
const { spawn } = require('child_process'); // Importar spawn

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

// 📌 **Ruta para obtener las estadísticas de un usuario específico**
router.get('/getEstadisticas/:usuari_id', async (req, res) => {
    try {
        const { usuari_id } = req.params;

        // Buscar las estadísticas del usuario en la base de datos
        const estadisticas = await Estadistica.find({ usuari_id });

        if (estadisticas.length === 0) {
            return res.status(404).json({ 
                message: `No se encontraron estadísticas para el usuario ${usuari_id}` 
            });
        }

        res.status(200).json({
            message: "Estadísticas obtenidas correctamente",
            data: estadisticas
        });
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        res.status(500).json({
            error: "Error interno del servidor",
            details: error.message
        });
    }
});

// Ruta para generar el gráfico por usuario
router.get('/grafico/:usuari_id', async (req, res) => {
    try {
        const { usuari_id } = req.params;

        // Ejecutar el script Python utilizando spawn
        const pythonProcess = spawn('python', ['grafico.py', usuari_id]);

        pythonProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                res.status(200).json({ message: 'Gráfico generado exitosamente' });
            } else {
                res.status(500).json({ error: 'Hubo un problema al generar el gráfico' });
            }
        });
    } catch (error) {
        console.error('Error al generar el gráfico:', error);
        res.status(500).json({ error: 'Error interno al generar el gráfico' });
    }
});

module.exports = router;
