const mongoose = require('mongoose');

const EstadistiquesSchema = new mongoose.Schema({
    usuari_id: { type: String, required: true },  // UUID del usuario
    temps: { type: Number, default: 0 },
    puntuacio: { type: Number, required: true, min: 0 },
});

const Estadistiques = mongoose.model('Estadistiques', EstadistiquesSchema);
module.exports = Estadistiques;
