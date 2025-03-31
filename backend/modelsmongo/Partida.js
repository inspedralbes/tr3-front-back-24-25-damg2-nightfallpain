const mongoose = require('mongoose');

const PartidaSchema = new mongoose.Schema({
    usuari_id: { 
        type: String, 
        required: true 
    },  // UUID del usuario
    tipus_partida: { 
        type: String, 
        enum: ['singleplayer'], // Debe ser un array con los valores permitidos
        required: true,
        default: 'singleplayer' // Establecemos valor por defecto
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Partida = mongoose.model('Partida', PartidaSchema);
module.exports = Partida;