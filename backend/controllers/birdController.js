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