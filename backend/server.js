const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const conectarDB = require('./config/mongo');
const { sequelize } = require('./models');
const usuariosRoutes = require('./routes/usuarisJugadors');
const enemicsRoutes = require('./routes/enemics');
const shopRoutes = require('./routes/shops');
const weaponRoutes = require('./routes/armes');
const partidaRoutes = require('./routes/partida');
const estadistiquesRoutes = require('./routes/estadistiques');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
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

app.use('/uploads/shop', express.static('/var/back/uploads/shop'));

// Usar rutas
app.use('/api/estadistiques', estadistiquesRoutes);
app.use('/api/armes', weaponRoutes);
app.use('/api/partida', partidaRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/enemics', enemicsRoutes);
app.use('/api/shops', (req, res, next) => {
    req.io = io; // Inyectar Socket.IO en la solicitud
    next();
}, shopRoutes);

// Conexión de Socket.IO
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
server.listen(PORT, "0.0.0.0", () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));

module.exports = { io }; // Exportar `io` para usarlo en las rutas
