const Cage = require('../models/Cage');

// Crear jaula amarrada al usuario
exports.createCage = async (req, res) => {
  try {
    const { name, type, maxCapacity } = req.body;
    const newCage = new Cage({
      name,
      type,
      maxCapacity,
      user: req.user.userId // <-- Extraído del Token por el middleware
    });
    const savedCage = await newCage.save();
    res.status(201).json({ mensaje: '¡Jaula creada con éxito! 🏠', cage: savedCage });
  } catch (error) {
    res.status(500).json({ error: 'Fallo al crear la jaula', detalle: error.message });
  }
};

// Obtener SOLO las jaulas del usuario logueado
exports.getCages = async (req, res) => {
  try {
    const cages = await Cage.find({ user: req.user.userId }).populate('birds');
    res.status(200).json(cages);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener jaulas', detalle: error.message });
  }
};

// Editar Jaula (Validando que sea del usuario)
exports.updateCage = async (req, res) => {
  try {
    const { name, type, maxCapacity } = req.body;
    const updatedCage = await Cage.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId }, // Filtro doble por ID y Usuario
      { name, type, maxCapacity },
      { new: true }
    );
    if (!updatedCage) return res.status(404).json({ error: 'Jaula no encontrada o no autorizada' });
    res.status(200).json({ mensaje: 'Jaula actualizada', cage: updatedCage });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar jaula', detalle: error.message });
  }
};

// Eliminar Jaula
exports.deleteCage = async (req, res) => {
  try {
    const cage = await Cage.findOne({ _id: req.params.id, user: req.user.userId });
    if (!cage) return res.status(404).json({ error: 'Jaula no encontrada' });
    if (cage.birds.length > 0) {
      return res.status(400).json({ error: 'No puedes eliminar una jaula con aves adentro.' });
    }
    await Cage.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: 'Jaula registrada eliminada. 🗑️' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar jaula', detalle: error.message });
  }
};