module.exports = (sequelize, DataTypes) => {
    const UsuarisJugadors = sequelize.define('Usuaris_Jugadors', {
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
        },
        nom: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        contrasenya: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        data_registre: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        es_admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        points: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    });

    return UsuarisJugadors;
};