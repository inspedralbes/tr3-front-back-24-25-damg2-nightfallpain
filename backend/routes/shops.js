const express = require('express');
const router = express.Router();
const { Shop } = require('../models');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define upload directory
const uploadDir = path.join(__dirname, '../../frontend/vuetify-project/public/uploads/shop');

// Modifica esta línea para usar recursive: true
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created directory: ${uploadDir}`);
}

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename with original extension
        const uniqueFilename = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    }
});

// File filter to only accept images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen (jpg, jpeg, png)'), false);
    }
};

// Initialize multer with our configurations
const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

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

// Función para eliminar imagen anterior si existe
const deleteOldImage = async (id) => {
    try {
        if (!id) return;
        
        const shop = await Shop.findByPk(id);
        if (!shop || !shop.image) return;
        
        // Verificar si la imagen existe en el directorio de uploads y no es una URL externa
        const imagePath = shop.image;
        if (imagePath.includes('/uploads/shop/')) {
            // Extraer nombre del archivo de la ruta
            const fileName = imagePath.split('/').pop();
            const filePath = path.join(uploadDir, fileName);
            
            // Comprobar si el archivo existe y eliminarlo
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Imagen anterior eliminada: ${filePath}`);
            }
        }
    } catch (error) {
        console.error('Error al eliminar imagen anterior:', error);
    }
};

// POST /shop - Crear un nuevo producto con imagen
router.post('/new', upload.single('image'), async (req, res) => {
    try {
        const { name, price, type, imageUrl } = req.body;
        
        if (!name || !price || !type) {
            // Si se subió un archivo, eliminarlo ya que no vamos a guardar el producto
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ message: 'Los campos nombre, precio y tipo son requeridos' });
        }
        
        let imagePath = '';
        
        // Si hay archivo de imagen, usar esa ruta
        if (req.file) {
            // Generar URL relativa para la imagen
            imagePath = `/uploads/shop/${req.file.filename}`;
        } else if (imageUrl) {
            // Si no hay archivo pero sí URL, mantener la URL
            imagePath = imageUrl;
        }
        
        const shop = await Shop.create({ 
            id: uuidv4(),
            name, 
            price, 
            type, 
            image: imagePath 
        });
        
        res.status(201).json(shop);
    } catch (error) {
        console.error(error);
        
        // Si hay un error y se subió un archivo, eliminarlo
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({ message: 'Error al crear el producto' });
    }
});

// PUT /shop/:id - Actualizar un producto con imagen
router.put('/update/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, price, type, imageUrl } = req.body;
        const shop = await Shop.findByPk(req.params.id);
        
        if (!shop) {
            // Si se subió un archivo, eliminarlo ya que no vamos a actualizar
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        let imagePath = shop.image; // Mantener la imagen actual por defecto
        
        // Si hay un nuevo archivo de imagen
        if (req.file) {
            // Eliminar la imagen anterior
            await deleteOldImage(req.params.id);
            
            // Establecer la nueva ruta de imagen
            imagePath = `/uploads/shop/${req.file.filename}`;
        } else if (imageUrl && imageUrl !== shop.image) {
            // Si no hay archivo pero hay una nueva URL
            imagePath = imageUrl;
        }
        
        await shop.update({ 
            name: name || shop.name, 
            price: price || shop.price, 
            type: type || shop.type, 
            image: imagePath 
        });
        
        res.json(shop);
    } catch (error) {
        console.error(error);
        
        // Si hay un error y se subió un archivo, eliminarlo
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});

// DELETE /shop/:id - Eliminar un producto
router.delete('/delete/:id', async (req, res) => {
    try {
        const shop = await Shop.findByPk(req.params.id);
        if (!shop) return res.status(404).json({ message: 'Producto no encontrado' });
        
        // Eliminar la imagen asociada si existe
        await deleteOldImage(req.params.id);
        
        // Eliminar el producto
        await shop.destroy();
        
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
});

module.exports = router;