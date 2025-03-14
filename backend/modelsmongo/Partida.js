const mongoose = require('mongoose');

const PartidaSchema = new mongoose.Schema({
    usuari_id: { 
        type: String, 
        required: true 
    },  // UUID del usuario
    tipus_partida: { 
        type: String, 
        enum: ['singleplayer', 'multiplayer'], 
        required: true 
    },
    estat: { 
        type: String, 
        enum: ['enJuego', 'Acabado'], 
        required: true 
    },
    id_coperative: { 
        type: String, 
        required: function() { 
            return this.tipus_partida === 'multiplayer'; 
        }
    }
});

const Partida = mongoose.model('Partida', PartidaSchema);
module.exports = Partida;