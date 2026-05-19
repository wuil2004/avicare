const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, cageId } = req.body;
    const newTask = new Task({
      title, description, dueDate, cage: cageId || null,
      user: req.user.userId // <-- Asignamos usuario
    });
    const savedTask = await newTask.save();
    res.status(201).json({ mensaje: 'Tarea agregada a la agenda', task: savedTask });
  } catch (error) {
    res.status(500).json({ error: 'Fallo al crear tarea', detalle: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    // Solo trae tareas del usuario
    const tasks = await Task.find({ user: req.user.userId }).populate('cage');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener agenda', detalle: error.message });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { completed: true },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });
    res.status(200).json({ mensaje: '¡Tarea completada! ✅', task });
  } catch (error) {
    res.status(500).json({ error: 'Fallo al completar tarea', detalle: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.status(200).json({ mensaje: 'Tarea eliminada. 🗑/ ' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tarea', detalle: error.message });
  }
};