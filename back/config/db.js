const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://a23ikedelgra:a23ikedelgra@estadistiques.nj1ar.mongodb.net/NightfallPainDB', {
        });
        console.log('✅ Conexión a MongoDB exitosa');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = conectarDB;
