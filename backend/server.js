const express = require('express');
const cors = require('cors'); // Importar CORS
const conectarDB = require('./config/mongo'); // Conexión a MongoDB
const { sequelize } = require('./models'); // Conexión a Sequelize
const usuariosRoutes = require('./routes/usuarisJugadors');
const enemicsRoutes = require('./routes/enemics');
const shopRoutes = require('./routes/shops');

const app = express();
app.use(express.json());

// 🛑 Configurar CORS para permitir peticiones del frontend
app.use(cors({
    origin: '*', // Puedes cambiar '*' por 'http://localhost:5173' si usas Vue en Vite
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use('/uploads/shop', express.static('uploads/shop'));

// Usar rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/enemics', enemicsRoutes);
app.use('/api/shops', shopRoutes);

// Conectar a MongoDB
conectarDB();

// Conectar a Sequelize (SQL)
sequelize.authenticate()
    .then(() => console.log('✅ Conexión a la base de datos SQL establecida.'))
    .catch(err => console.error('❌ Error al conectar a la base de datos SQL:', err));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));

