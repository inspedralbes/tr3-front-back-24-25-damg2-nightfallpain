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
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('skin', 'weapon'),  // Aquí defines los valores permitidos
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
