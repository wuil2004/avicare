const Bird = require('../models/Bird');
const Cage = require('../models/Cage');

exports.createBird = async (req, res) => {
  try {
    const { ringNumber, species, gender, cageId } = req.body;
    const photo = req.file ? req.file.path : null; // Atrapamos la URL de Cloudinary

    // SISTEMA ANTI-PELEAS 🛡️
    if (cageId) {
      const cage = await Cage.findById(cageId).populate('birds');
      if (cage && cage.birds.length > 0) {
        const especieExistente = cage.birds[0].species;
        // Si la especie que ya vive ahí es diferente a la nueva, bloqueamos la acción
        if (especieExistente !== species) {
          return res.status(400).json({ 
            error: `¡Alto ahí! No puedes mezclar un ${species} en la misma jaula donde ya hay un ${especieExistente}.` 
          });
        }
      }
    }

    // Si pasó la seguridad, creamos el ave
    const newBird = new Bird({
      ringNumber,
      species,
      gender,
      photo,
      cage: cageId || null
    });

    const savedBird = await newBird.save();

    // Metemos el ID del ave en la jaula
    if (cageId) {
      await Cage.findByIdAndUpdate(cageId, { $push: { birds: savedBird._id } });
    }

    res.status(201).json({ mensaje: '¡Ave registrada y alojada con éxito! 🐦', bird: savedBird });
  } catch (error) {
    res.status(500).json({ error: 'Fallo al registrar el ave', detalle: error.message });
  }
};

// Editar datos de un ave
exports.updateBird = async (req, res) => {
  try {
    const { ringNumber, species, gender, status } = req.body;
    const updateData = { ringNumber, species, gender, status };
    if (req.file) updateData.photo = req.file.path; // Si sube nueva foto

    const updatedBird = await Bird.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ mensaje: '¡Expediente de ave actualizado! 📝', bird: updatedBird });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar ave', detalle: error.message });
  }
};

// Eliminar un ave (Y sacarla de la jaula donde vivía)
exports.deleteBird = async (req, res) => {
  try {
    const bird = await Bird.findById(req.params.id);
    if (!bird) return res.status(404).json({ error: 'Ave no encontrada' });

    // Si estaba en una jaula, la sacamos de la lista de esa jaula
    if (bird.cage) {
      await Cage.findByIdAndUpdate(bird.cage, { $pull: { birds: bird._id } });
    }

    await Bird.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: 'Ave eliminada del inventario correctamente. 👋' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar ave', detalle: error.message });
  }
};

// Mudar un ave de jaula (Con validación anti-peleas) 🔄
exports.moveBird = async (req, res) => {
  try {
    const { newCageId } = req.body;
    const bird = await Bird.findById(req.params.id);
    if (!bird) return res.status(404).json({ error: 'Ave no encontrada' });

    if (newCageId) {
      const newCage = await Cage.findById(newCageId).populate('birds');
      // Validar si la nueva jaula tiene una especie diferente
      if (newCage && newCage.birds.length > 0 && newCage.birds[0].species !== bird.species) {
        return res.status(400).json({ 
          error: `¡Incompatibilidad! No puedes mudar este ${bird.species} a una jaula con ${newCage.birds[0].species}.` 
        });
      }
    }

    // 1. Quitar de la jaula vieja
    if (bird.cage) {
      await Cage.findByIdAndUpdate(bird.cage, { $pull: { birds: bird._id } });
    }

    // 2. Asignar la nueva jaula en el ave
    bird.cage = newCageId || null;
    await bird.save();

    // 3. Meter en la jaula nueva
    if (newCageId) {
      await Cage.findByIdAndUpdate(newCageId, { $push: { birds: bird._id } });
    }

    res.status(200).json({ mensaje: '¡Ave mudada de casa con éxito! 🏠', bird });
  } catch (error) {
    res.status(500).json({ error: 'Error al mudar ave', detalle: error.message });
  }
};