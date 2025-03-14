module.exports = (sequelize, DataTypes) => {
    const Shop = sequelize.define('Shop', {
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    });

    // Relación con UsuarisJugadors
    Shop.associate = (models) => {
        Shop.belongsTo(models.UsuarisJugadors, {
            foreignKey: 'usuari_id',
            onDelete: 'CASCADE',
        });
    };

    return Shop;
};