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
router.get('/maintenance/status', (req, res) => {
    res.json({ maintenance: maintenanceMode });
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
// 📌 Ruta para obtener solo los usuari_id únicos
router.get('/usuaris-ids', async (req, res) => {
    try {
        // Agregación para obtener solo los IDs de usuario únicos
        const usuaris = await Estadistica.aggregate([
            {
                $group: {
                    _id: "$usuari_id"
                }
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id"
                }
            },
            { $sort: { id: 1 } }
        ]);

        res.status(200).json({
            message: "IDs de usuario obtenidos correctamente",
            data: usuaris
        });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
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

// Ruta para generar y devolver el gráfico por usuario
router.get('/grafico/:usuari_id', async (req, res) => {
    try {
        const { usuari_id } = req.params;
        const path = require('path');
        const fs = require('fs');
        
        // 1. Verificar si hay datos para el usuario
        const tieneDatos = await Estadistica.exists({ usuari_id });
        if (!tieneDatos) {
            return res.status(404).json({
                error: 'Usuario sin datos',
                message: `No hay estadísticas para el usuario ${usuari_id}`
            });
        }

        // 2. Configuración de rutas
        const outputDir = path.join(__dirname, '..', 'graficos');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        const outputFile = path.join(outputDir, `grafico_usuario_${usuari_id}.png`);
        
        // 3. Eliminar gráfico existente si hay
        if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
        }

        // 4. Configuración Python
        const pythonPath = '/usr/bin/python3';
        const scriptPath = path.join(__dirname, '..', 'python', 'grafico.py');
        
        console.log(`Ejecutando: ${pythonPath} ${scriptPath} ${usuari_id}`);
        
        // 5. Ejecutar Python
        const pythonProcess = spawn(pythonPath, [scriptPath, usuari_id]);

        let errorData = '';
        let outputData = '';
        
        pythonProcess.stdout.on('data', (data) => {
            outputData += data.toString();
            console.log(`Python stdout: ${data}`);
        });
        
        pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
            console.error(`Python stderr: ${data}`);
        });
        
        // 6. Manejar resultado
        pythonProcess.on('close', (code) => {
            if (code === 0 && fs.existsSync(outputFile)) {
                res.setHeader('Content-Type', 'image/png');
                return fs.createReadStream(outputFile).pipe(res);
            } else {
                const errorDetails = {
                    error: 'Error al generar el gráfico',
                    pythonError: errorData,
                    output: outputData,
                    exitCode: code,
                    fileExists: fs.existsSync(outputFile)
                };
                console.error('Error en Python:', errorDetails);
                return res.status(500).json(errorDetails);
            }
        });
        
        pythonProcess.on('error', (err) => {
            console.error('Error al iniciar Python:', err);
            return res.status(500).json({
                error: 'Error al ejecutar Python',
                details: err.message
            });
        });
        
    } catch (error) {
        console.error('Error en endpoint /grafico:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            details: error.message 
        });
    }
});

module.exports = router;
