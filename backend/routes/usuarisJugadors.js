const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { UsuarisJugadors } = require('../models');

const router = express.Router();

// 📌 REGISTRAR USUARIO
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, speed, health, damage, arma, shop } = req.body;

        // Validar que los campos obligatorios estén presentes
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Todos los campos son obligatorios (nombre, email y contraseña)" });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "El correo no tiene un formato válido" });
        }

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
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'tu_clave_secreta'; // Cambia esto por una clave secreta segura

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

        // Generar token JWT
        const token = jwt.sign({ id: user.id, email: user.email, admin: user.admin }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: 'Inicio de sesión exitoso', token, user });
    } catch (error) {
        res.status(500).json({ error: 'Error en el inicio de sesión' });
    }
});

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.admin) {
        next();
    } else {
        res.status(403).json({ error: 'Acceso denegado: se requieren permisos de administrador' });
    }
};
router.get('/admin', authenticateJWT, isAdmin, (req, res) => {
    res.json({ message: 'Bienvenido al dashboard de administrador', user: req.user });
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
