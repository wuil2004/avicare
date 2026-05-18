const mongoose = require('mongoose');

const nestSchema = new mongoose.Schema({
  cage: { type: mongoose.Schema.Types.ObjectId, ref: 'Cage', required: true },
  mother: { type: mongoose.Schema.Types.ObjectId, ref: 'Bird', required: true },
  father: { type: mongoose.Schema.Types.ObjectId, ref: 'Bird', required: true },
  layDate: { type: Date, required: true }, // Día que puso el huevo
  hatchDate: { type: Date, required: true }, // Día estimado de nacimiento
  eggCount: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Nest', nestSchema);