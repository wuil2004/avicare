const Bird = require('../models/Bird');
const Cage = require('../models/Cage');

exports.createBird = async (req, res) => {
  try {
    const { ringNumber, species, gender, cageId } = req.body;
    const photo = req.file ? req.file.path : null;

    // Control Anti-Peleas (Buscando la jaula del mismo usuario)
    if (cageId) {
      const cage = await Cage.findOne({ _id: cageId, user: req.user.userId }).populate('birds');
      if (!cage) return res.status(404).json({ error: 'La jaula especificada no existe.' });
      
      if (cage.birds.length > 0 && cage.birds[0].species !== species) {
        return res.status(400).json({ 
          error: `¡Alto ahí! No puedes mezclar un ${species} en la misma jaula donde ya hay un ${cage.birds[0].species}.` 
        });
      }
    }

    const newBird = new Bird({
      ringNumber, species, gender, photo,
      cage: cageId || null,
      user: req.user.userId // <-- Guardamos al dueño
    });

    const savedBird = await newBird.save();

    if (cageId) {
      await Cage.findByIdAndUpdate(cageId, { $push: { birds: savedBird._id } });
    }

    res.status(201).json({ mensaje: '¡Ave registrada y alojada con éxito! 🐦', bird: savedBird });
  } catch (error) {
    res.status(500).json({ error: 'Fallo al registrar el ave', detalle: error.message });
  }
};

// Obtener solo las aves del usuario logueado
exports.getBirds = async (req, res) => {
  try {
    const birds = await Bird.find({ user: req.user.userId }).populate('cage');
    res.status(200).json(birds);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener aves', detalle: error.message });
  }
};

exports.updateBird = async (req, res) => {
  try {
    const { ringNumber, species, gender } = req.body;
    const updateData = { ringNumber, species, gender };
    if (req.file) updateData.photo = req.file.path;

    const updatedBird = await Bird.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      updateData,
      { new: true }
    );
    if (!updatedBird) return res.status(404).json({ error: 'Ave no encontrada o no autorizada' });
    res.status(200).json({ mensaje: '¡Expediente de ave actualizado! 📝', bird: updatedBird });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar ave', detalle: error.message });
  }
};

exports.deleteBird = async (req, res) => {
  try {
    const bird = await Bird.findOne({ _id: req.params.id, user: req.user.userId });
    if (!bird) return res.status(404).json({ error: 'Ave no encontrada' });

    if (bird.cage) {
      await Cage.findByIdAndUpdate(bird.cage, { $pull: { birds: bird._id } });
    }

    await Bird.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: 'Ave eliminada del inventario correctamente. 👋' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar ave', detalle: error.message });
  }
};

exports.moveBird = async (req, res) => {
  try {
    const { newCageId } = req.body;
    const bird = await Bird.findOne({ _id: req.params.id, user: req.user.userId });
    if (!bird) return res.status(404).json({ error: 'Ave no encontrada' });

    if (newCageId) {
      const newCage = await Cage.findOne({ _id: newCageId, user: req.user.userId }).populate('birds');
      if (!newCage) return res.status(404).json({ error: 'La jaula de destino no existe.' });
      if (newCage.birds.length > 0 && newCage.birds[0].species !== bird.species) {
        return res.status(400).json({ 
          error: `¡Incompatibilidad! No puedes mudar este ${bird.species} a una jaula con ${newCage.birds[0].species}.` 
        });
      }
    }

    if (bird.cage) {
      await Cage.findByIdAndUpdate(bird.cage, { $pull: { birds: bird._id } });
    }

    bird.cage = newCageId || null;
    await bird.save();

    if (newCageId) {
      await Cage.findByIdAndUpdate(newCageId, { $push: { birds: bird._id } });
    }

    res.status(200).json({ mensaje: '¡Ave mudada de casa con éxito! 🏠', bird });
  } catch (error) {
    res.status(500).json({ error: 'Error al mudar ave', detalle: error.message });
  }
};