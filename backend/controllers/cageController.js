const Cage = require('../models/Cage');

// Función para obtener todas las jaulas y ver qué pájaros tienen adentro
exports.getCages = async (req, res) => {
  try {
    const cages = await Cage.find().populate('birds'); // <-- Aquí ocurre la magia
    res.status(200).json(cages);
  } catch (error) {
    res.status(500).json({ error: 'Fallo al consultar las jaulas', detalle: error.message });
  }
};