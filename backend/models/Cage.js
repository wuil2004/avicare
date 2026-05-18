const mongoose = require('mongoose');

const cageSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true // Borra espacios vacíos al inicio o final (ej. " Jaula 1 " -> "Jaula 1")
  },
  type: { 
    type: String, 
    enum: ['Cría', 'Vuelo', 'Hospital', 'General'], 
    default: 'General' 
  },
  maxCapacity: { 
    type: Number, 
    required: true,
    default: 10
  },
  // Una lista de IDs de las aves que están adentro de esta jaula actualmente
  birds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bird' 
  }]
}, { 
  timestamps: true // Crea automáticamente las fechas de creación y actualización
});

module.exports = mongoose.model('Cage', cageSchema);