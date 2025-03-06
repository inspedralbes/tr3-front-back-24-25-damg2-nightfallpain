const express = require('express');
const conectarDB = require('./config/mongo'); // Conexión a MongoDB
const { sequelize } = require('./models'); // Conexión a Sequelize
const routes = require('./routes');

const app = express();
app.use(express.json());

// Conectar a MongoDB
conectarDB();

// Conectar a Sequelize (SQL)
sequelize.authenticate()
    .then(() => console.log('Conexión a la base de datos SQL establecida.'))
    .catch(err => console.error('Error al conectar a la base de datos SQL:', err));

// Usar rutas
app.use('/api', routes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));