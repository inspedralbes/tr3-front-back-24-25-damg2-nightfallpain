module.exports = (sequelize, DataTypes) => {
    const Armes = sequelize.define('Armes', {
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        damage: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        speed: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    return Armes;
};