const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Importar la configuración de Sequelize

// Cargar modelos
const UsuarisJugadors = require('./UsuarisJugadors')(sequelize, DataTypes);
const Armes = require('./Armes')(sequelize, DataTypes);
const Skins = require('./Skins')(sequelize, DataTypes);
const Enemics = require('./Enemics')(sequelize, DataTypes);

// Establecer relaciones (si las hay)
Skins.belongsTo(UsuarisJugadors, { foreignKey: 'usuari_id', onDelete: 'CASCADE' });

// Sincronizar modelos con la base de datos (opcional)
sequelize.sync()
    .then(() => console.log('Modelos sincronizados con la base de datos.'))
    .catch(err => console.error('Error al sincronizar modelos:', err));

// Exportar modelos y sequelize
module.exports = {
    sequelize,
    UsuarisJugadors,
    Armes,
    Skins,
    Enemics,
};