const { Sequelize } = require('sequelize');

// Configuración de Sequelize para conectarse al contenedor MySQL
const sequelize = new Sequelize('mydatabase', 'myuser', 'mypassword', {
    host: 'mysql', // Nombre del contenedor MySQL
    dialect: 'mysql', // Usamos MySQL
    logging: false, // Desactiva los logs de SQL en la consola
});

module.exports = sequelize;