const mongoose = require('mongoose');

const PartidaSchema = new mongoose.Schema({
    usuari_id: { type: String, required: true },  // UUID del usuario
    data_inici: { type: Date, default: Date.now },
    data_fi: { type: Date },
    resultat: { type: String }
});

const Partida = mongoose.model('Partida', PartidaSchema);
module.exports = Partida;
