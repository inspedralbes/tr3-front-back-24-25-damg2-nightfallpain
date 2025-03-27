const { Sequelize } = require('sequelize');

// Configuración de Sequelize para conectarse a MySQL en hestia
const sequelize = new Sequelize('a23ikedelgra_nightfallpain', 'a23ikedelgra_nightfall', 'Ldw86kaHa1.4', {
    host: 'dam.inspedralbes.cat', // URL del servidor MySQL
    port: 3306, // Puerto de MySQL
    dialect: 'mysql', // Usamos MySQL
    logging: false, // Desactiva los logs de SQL en la consola
});

module.exports = sequelize;