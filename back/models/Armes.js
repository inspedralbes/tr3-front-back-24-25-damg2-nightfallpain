module.exports = (sequelize, DataTypes) => {
    const Armes = sequelize.define('Armes', {
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
        },
        nom: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        dany: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        raresa: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        atributs: {
            type: DataTypes.JSON,
            allowNull: false,
        },
    });

    return Armes;
};