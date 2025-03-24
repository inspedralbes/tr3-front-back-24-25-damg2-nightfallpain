const express = require('express');
const router = express.Router();
const { Enemics } = require('../models');

// Obtener todos los enemigos
router.get('/all', async (req, res) => {
    try {
        const enemics = await Enemics.findAll();
        res.status(200).json(enemics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/game/all', async (req, res) => {
    try {
        const enemics = await Enemics.findAll();

        // Convertimos los datos y añadimos bulletName según el name
        const enemies = enemics.map(enemy => {
            return {
                name: enemy.name,
                health: enemy.health,
                speed: enemy.speed,
                damage: enemy.damage,
                bulletName: getBulletName(enemy.name) // Asignamos el bulletName aquí
            };
        });

        res.status(200).json({ enemies }); // Enviamos como un objeto con una lista "enemies"
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Función para asignar bulletName según el nombre del enemigo
function getBulletName(enemyName) {
    switch (enemyName) {
        case "Enemy":
            return "bulletEnemy";
        case "EnemyUzi":
            return "bulletEnemyUzi";
        default:
            return "bullet"; // Valor por defecto
    }
}


// Actualizar la vida, daño o velocidad de un enemigo específico
router.put('/update/:id', async (req, res) => {
    const { id } = req.params; // ID del enemigo
    const { health, damage, speed } = req.body; // Los nuevos valores a actualizar
    
    try {
        const enemy = await Enemics.findByPk(id);
        
        if (!enemy) {
            return res.status(404).json({ message: 'Enemigo no encontrado' });
        }

        // Solo actualizamos las propiedades que se proporcionan
        if (health !== undefined) enemy.health = health;
        if (damage !== undefined) enemy.damage = damage;
        if (speed !== undefined) enemy.speed = speed;

        await enemy.save(); // Guardamos los cambios en la base de datos

        res.status(200).json(enemy); // Respondemos con el enemigo actualizado
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
