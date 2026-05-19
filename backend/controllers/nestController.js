const Nest = require('../models/Nest');
const Task = require('../models/Task');

exports.createNest = async (req, res) => {
  try {
    const { cageId, motherId, fatherId, layDate, eggCount } = req.body;
    
    const hatchDate = new Date(layDate);
    hatchDate.setDate(hatchDate.getDate() + 14);

    const newNest = new Nest({ 
      cage: cageId, mother: motherId, father: fatherId, layDate, hatchDate, eggCount,
      user: req.user.userId // <-- Amarrado al usuario
    });
    const savedNest = await newNest.save();

    // La tarea automatizada se genera en la cuenta del mismo usuario
    const alertTask = new Task({
      title: `¡Nacimiento esperado! (${eggCount} huevos)`,
      description: `Revisar nido. Los pichones deberían estar naciendo hoy.`,
      dueDate: hatchDate,
      cage: cageId,
      user: req.user.userId // <-- Amarrado automáticamente al usuario
    });
    await alertTask.save();

    res.status(201).json({ 
      mensaje: 'Nido registrado y alerta vinculada a tu cuenta con éxito. 🥚', 
      nest: savedNest 
    });
  } catch (error) {
    res.status(500).json({ error: 'Fallo al registrar el nido', detalle: error.message });
  }
};