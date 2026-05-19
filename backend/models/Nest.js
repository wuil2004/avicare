const mongoose = require('mongoose');

const nestSchema = new mongoose.Schema({
  cage: { type: mongoose.Schema.Types.ObjectId, ref: 'Cage', required: true },
  mother: { type: mongoose.Schema.Types.ObjectId, ref: 'Bird', required: true },
  father: { type: mongoose.Schema.Types.ObjectId, ref: 'Bird', required: true },
  layDate: { type: Date, required: true },
  hatchDate: { type: Date, required: true },
  eggCount: { type: Number, default: 1 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // <-- Dueño del nido 🔐
}, { timestamps: true });

module.exports = mongoose.model('Nest', nestSchema);