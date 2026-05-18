const mongoose = require('mongoose');

const birdSchema = new mongoose.Schema({
  ringNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true // El número de anillo o placa identificadora única
  },
  species: { 
    type: String, 
    required: true // Ej. 'Canario Japonés', 'Periquito Australiano', etc.
  },
  gender: { 
    type: String, 
    enum: ['Macho', 'Hembra', 'Desconocido'], 
    default: 'Desconocido' 
  },
  birthDate: { 
    type: Date 
  },
  // Conexión relacional: ID de la jaula donde vive
  cage: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cage', 
    default: null 
  },
  // Árbol genealógico: IDs de otros pájaros que son sus padres
  father: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bird', 
    default: null 
  },
  mother: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bird', 
    default: null 
  },
  status: { 
    type: String, 
    enum: ['Activo', 'Enfermo', 'Cuarentena', 'Vendido', 'Fallecido'], 
    default: 'Activo' 
  },
  photo: { 
    type: String, 
    default: null // Aquí guardaremos la URL que nos dé Cloudinary más adelante
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Bird', birdSchema);