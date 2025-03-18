const express = require('express');
const router = express.Router();
const { Shop } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Variable para el estado de mantenimiento
let mantenimientoActivo = false;

// Añadir este nuevo endpoint para controlar el modo mantenimiento
router.post('/mantenimiento', async (req, res) => {
    try {
        const { activo } = req.body;
        mantenimientoActivo = activo;
        res.json({ 
            mensaje: activo ? 'Tienda en mantenimiento' : 'Tienda activa', 
            mantenimiento: mantenimientoActivo 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al cambiar el estado de mantenimiento' });
    }
});

// Añadir endpoint para consultar el estado de mantenimiento
router.get('/mantenimiento', (req, res) => {
    res.json({ mantenimiento: mantenimientoActivo });
});

// Modificar el endpoint GET /shop para que permita acceso al admin durante mantenimiento
router.get('/shop', async (req, res) => {
    try {
        // Comprobar si está en mantenimiento y el usuario NO es admin
        if (mantenimientoActivo && (!req.headers.authorization || !isAdminToken(req.headers.authorization))) {
            return res.status(503).json({
                mensaje: 'Tienda en mantenimiento. Vuelva más tarde.',
                mantenimiento: true
            });
        }
        
        // Si no está en mantenimiento o el usuario es admin, devolver productos
        const shops = await Shop.findAll();
        res.json(shops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener la tienda' });
    }
});

// Función auxiliar para verificar si el token es de un administrador
function isAdminToken(authHeader) {
    try {
        // Extraer el token del header (Bearer token)
        const token = authHeader.split(' ')[1];
        
        // Aquí debes implementar la verificación del token para determinar si es un admin
        // Esto dependerá de cómo tengas implementada tu autenticación
        
        // Por ejemplo, si usas JWT podrías hacer algo así:
        // const decoded = jwt.verify(token, 'tu_secreto_jwt');
        // return decoded && decoded.admin === true;
        
        // Como no tenemos el código de autenticación, supondremos que el token es válido
        // y que el usuario es admin si hay un token presente
        return token ? true : false;
    } catch (error) {
        console.error('Error verificando token de admin:', error);
        return false;
    }
}

// GET /shop/:id - Obtener un producto por ID
router.get('/shop/:id', async (req, res) => {
    try {
        // Comprobar si está en mantenimiento y el usuario NO es admin
        if (mantenimientoActivo && (!req.headers.authorization || !isAdminToken(req.headers.authorization))) {
            return res.status(503).json({
                mensaje: 'Tienda en mantenimiento. Vuelva más tarde.',
                mantenimiento: true
            });
        }
        
        const shop = await Shop.findByPk(req.params.id);
        if (!shop) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(shop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
});

// POST /shop - Crear un nuevo producto
router.post('/new', async (req, res) => {
    try {
        const { name, price, type, image } = req.body;
        if (!name || !price || !type || !image) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }
        const shop = await Shop.create({ id: uuidv4(), name, price, type, image });
        res.status(201).json(shop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
});

// PUT /shop/:id - Actualizar un producto
router.put('/update/:id', async (req, res) => {
    try {
        const { name, price, type, image } = req.body;
        const shop = await Shop.findByPk(req.params.id);
        if (!shop) return res.status(404).json({ message: 'Producto no encontrado' });
        await shop.update({ name, price, type, image });
        res.json(shop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});

// DELETE /shop/:id - Eliminar un producto
router.delete('/delete/:id', async (req, res) => {
    try {
        const shop = await Shop.findByPk(req.params.id);
        if (!shop) return res.status(404).json({ message: 'Producto no encontrado' });
        await shop.destroy();
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
});

module.exports = router;