const Nest = require('../models/Nest');
const Task = require('../models/Task');

exports.createNest = async (req, res) => {
  try {
    const { cageId, motherId, fatherId, layDate, eggCount } = req.body;
    
    // Matemática de fechas: sumamos 14 días (estándar canarios) a la fecha de puesta
    const hatchDate = new Date(layDate);
    hatchDate.setDate(hatchDate.getDate() + 14);

    const newNest = new Nest({ cage: cageId, mother: motherId, father: fatherId, layDate, hatchDate, eggCount });
    const savedNest = await newNest.save();

    // 🤖 AUTOMATIZACIÓN: Creamos una alerta en la agenda para el día del nacimiento
    const alertTask = new Task({
      title: `¡Nacimiento esperado! (${eggCount} huevos)`,
      description: `Revisar nido. Los pichones deberían estar naciendo hoy.`,
      dueDate: hatchDate,
      cage: cageId
    });
    await alertTask.save();

    res.status(201).json({ 
      mensaje: 'Nido registrado. Alerta de nacimiento programada automáticamente en la agenda. 🥚', 
      nest: savedNest 
    });
  } catch (error) {
    res.status(500).json({ error: 'Fallo al registrar el nido', detalle: error.message });
  }
};