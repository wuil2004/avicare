const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true // Ej: "Cambiar agua", "Poner pasta de cría"
  },
  description: { 
    type: String,
    default: "" // Detalles extra, ej: "Usar 5 gotas de vitaminas en el bebedero"
  },
  dueDate: { 
    type: Date, 
    required: true // ¿Para cuándo es esta tarea?
  },
  completed: { 
    type: Boolean, 
    default: false // Cuando le des "Check" en el celular, esto pasará a true
  },
  // ¿A quién le toca esta tarea? Podemos asignarla a una jaula entera o a un pájaro específico
  cage: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cage',
    default: null
  },
  bird: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bird',
    default: null
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Task', taskSchema);