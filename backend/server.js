const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const conectarDB = require('./config/mongo');
const { sequelize } = require('./models');
const usuariosRoutes = require('./routes/usuarisJugadors');
const enemicsRoutes = require('./routes/enemics');
const shopRoutes = require('./routes/shops');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Ajusta esto a tu dominio específico en producción
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

app.use(express.json());

// Configurar CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/uploads/shop', express.static('uploads/shop'));

// Usar rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/enemics', enemicsRoutes);
app.use('/api/shops', (req, res, next) => {
    req.io = io; // Inyectar Socket.IO en la solicitud
    next();
}, shopRoutes);

// Conexión de Socket
io.on('connection', (socket) => {
    console.log('Cliente conectado via Socket');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Conectar a MongoDB
conectarDB();

// Conectar a Sequelize (SQL)
sequelize.authenticate()
    .then(() => console.log('✅ Conexión a la base de datos SQL establecida.'))
    .catch(err => console.error('❌ Error al conectar a la base de datos SQL:', err));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));

module.exports = { io }; // Exportar para uso en otras partes si es necesario