const express = require('express');
const router = express.Router();
const birdController = require('../controllers/birdController');
const { upload } = require('../config/cloudinary');

// Agregamos upload.single('photo') como interceptor
router.post('/', upload.single('photo'), birdController.createBird);

module.exports = router;