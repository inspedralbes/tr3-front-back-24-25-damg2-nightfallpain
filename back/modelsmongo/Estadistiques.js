const mongoose = require('mongoose');

const EstadistiquesSchema = new mongoose.Schema({
    usuari_id: { type: String, required: true },  // UUID del usuario
    partides_jugades: { type: Number, default: 0 },
    victories: { type: Number, default: 0 },
    derrotes: { type: Number, default: 0 }
});

const Estadistiques = mongoose.model('Estadistiques', EstadistiquesSchema);
module.exports = Estadistiques;
