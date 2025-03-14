module.exports = (sequelize, DataTypes) => {
    const Enemics = sequelize.define('Enemics', {
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        health: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        damage: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        speed: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    return Enemics;
};