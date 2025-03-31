module.exports = (sequelize, DataTypes) => {
    const UsuarisJugadors = sequelize.define('Usuaris_Jugadors', {
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        date_register: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        xp: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        speed:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        maxBullets:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        health:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        damage:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        skinName:{
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        arma:{
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        shop:{
            type: DataTypes.JSON,
            allowNull: false,
        },
    }, {
        timestamps: false  // 🚀 Esto desactiva createdAt y updatedAt
    });

    return UsuarisJugadors;
};
