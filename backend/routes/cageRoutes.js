const express = require('express');
const router = express.Router();
const cageController = require('../controllers/cageController');

// Cuando alguien pida un GET a la ruta, le mostramos las jaulas
router.get('/', cageController.getCages);

module.exports = router;