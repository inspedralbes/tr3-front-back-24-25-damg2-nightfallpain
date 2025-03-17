const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { UsuarisJugadors } = require('../models');

const router = express.Router();

// 📌 REGISTRAR USUARIO
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, speed, health, damage, arma, shop } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await UsuarisJugadors.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "El correo ya está registrado" });
        }

        // Encriptar la password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario con valores por defecto si no se envían
        const newUser = await UsuarisJugadors.create({
            id: crypto.randomUUID(),
            name,
            email,
            password: hashedPassword,
            speed: speed || 10,      // Valor por defecto: 10
            health: health || 100,   // Valor por defecto: 100
            damage: damage || 25,    // Valor por defecto: 25
            arma: arma || "espada",  // Valor por defecto: "espada"
            shop: shop || "Tienda1"  // Valor por defecto: "Tienda1"
        });

        res.status(201).json({ message: "Usuario registrado con éxito", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar el usuario", details: error.message });
    }
});

// 📌 INICIAR SESIÓN (sin JWT)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const user = await UsuarisJugadors.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
        }

        // Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
        }

        res.json({ message: 'Inicio de sesión exitoso', user });
    } catch (error) {
        res.status(500).json({ error: 'Error en el inicio de sesión' });
    }
});
// 📌 OBTENER TODOS LOS USUARIOS
router.get('/all', async (req, res) => {
    try {
        const usuarios = await UsuarisJugadors.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios', details: error.message });
    }
});

// 📌 ELIMINAR USUARIO
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar al usuario
        const user = await UsuarisJugadors.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Eliminar usuario
        await UsuarisJugadors.destroy({ where: { id } });

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario', details: error.message });
    }
});

module.exports = router;
