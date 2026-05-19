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

// Editar Jaula
exports.updateCage = async (req, res) => {
  try {
    const { name, type, maxCapacity } = req.body;
    const updatedCage = await Cage.findByIdAndUpdate(req.params.id, { name, type, maxCapacity }, { new: true });
    res.status(200).json({ mensaje: 'Jaula actualizada con éxito', cage: updatedCage });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar jaula', detalle: error.message });
  }
};

// Eliminar Jaula (¡Solo si está vacía!) 🚫🏠
exports.deleteCage = async (req, res) => {
  try {
    const cage = await Cage.findById(req.params.id);
    if (!cage) return res.status(404).json({ error: 'Jaula no encontrada' });

    // Seguridad: si tiene aves adentro, no dejamos que la borren
    if (cage.birds.length > 0) {
      return res.status(400).json({ error: 'No puedes eliminar una jaula que todavía tiene aves hospedadas.' });
    }

    await Cage.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: 'Jaula eliminada del sistema. 🗑️' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar jaula', detalle: error.message });
  }
};