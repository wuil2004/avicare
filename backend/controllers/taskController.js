const Task = require('../models/Task');

// 1. Crear una nueva tarea
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, cageId, birdId } = req.body;
    
    const newTask = new Task({
      title,
      description,
      dueDate,
      cage: cageId || null,
      bird: birdId || null
    });
    
    const savedTask = await newTask.save();
    
    res.status(201).json({ 
      mensaje: '¡Tarea programada en la agenda! 📝', 
      task: savedTask 
    });
  } catch (error) {
    res.status(500).json({ error: 'Fallo al crear la tarea', detalle: error.message });
  }
};

// 2. Obtener la agenda (con datos de las jaulas y pájaros poblados)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('cage') // Trae los datos de la jaula
      .populate('bird'); // Trae los datos del ave (si es que la tarea es para un ave en específico)
      
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Fallo al consultar la agenda', detalle: error.message });
  }
};

// 3. Marcar tarea como completada
exports.completeTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    // Busca la tarea por su ID y le cambia el completed a true
    const task = await Task.findByIdAndUpdate(
      taskId, 
      { completed: true }, 
      { new: true }
    );
    res.status(200).json({ mensaje: '¡Tarea completada! ✅', task });
  } catch (error) {
    res.status(500).json({ error: 'Fallo al completar la tarea', detalle: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: 'Tarea eliminada de la agenda. 🗑️' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tarea', detalle: error.message });
  }
};