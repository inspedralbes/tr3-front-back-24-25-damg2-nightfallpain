module.exports = (sequelize, DataTypes) => {
    const Enemics = sequelize.define('Enemics', {
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
        },
        nom: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        vida: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        atac: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        comportament: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    });

    return Enemics;
};