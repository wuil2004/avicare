const mongoose = require('mongoose');

const birdSchema = new mongoose.Schema({
  ringNumber: { type: String, required: true },
  species: { type: String, required: true },
  gender: { type: String, required: true },
  photo: { type: String }, 
  cage: { type: mongoose.Schema.Types.ObjectId, ref: 'Cage' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // <-- Dueño del ave 🔐
}, { timestamps: true });

module.exports = mongoose.model('Bird', birdSchema);