const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { upload } = require('../config/cloudinary'); // Importamos el subidor

// Le ponemos "upload.single('image')" como guardia para interceptar la foto
router.post('/consult', upload.single('image'), aiController.consultVeterinarian);

module.exports = router;