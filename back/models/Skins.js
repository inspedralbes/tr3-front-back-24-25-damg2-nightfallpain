module.exports = (sequelize, DataTypes) => {
    const Skins = sequelize.define('Skins', {
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
        },
        usuari_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
        },
        nom: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        preu: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        data_compra: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    // Relación con UsuarisJugadors
    Skins.associate = (models) => {
        Skins.belongsTo(models.UsuarisJugadors, {
            foreignKey: 'usuari_id',
            onDelete: 'CASCADE',
        });
    };

    return Skins;
};