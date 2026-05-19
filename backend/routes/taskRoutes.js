const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.put('/:id/complete', taskController.completeTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;