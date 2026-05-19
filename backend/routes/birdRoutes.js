const express = require('express');
const router = express.Router();
const birdController = require('../controllers/birdController');
const { upload } = require('../config/cloudinary');

// Agregamos upload.single('photo') como interceptor
router.post('/', upload.single('photo'), birdController.createBird);

// Nuevas rutas de mantenimiento
router.put('/:id', upload.single('photo'), birdController.updateBird);
router.delete('/:id', birdController.deleteBird);
router.put('/:id/move', birdController.moveBird); // Mudar ave

module.exports = router;