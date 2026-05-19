const mongoose = require('mongoose');

const cageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // Ej: "Cría", "Voladera"
  maxCapacity: { type: Number, required: true },
  birds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bird' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // <-- El amarre 🔐
}, { timestamps: true });

module.exports = mongoose.model('Cage', cageSchema);