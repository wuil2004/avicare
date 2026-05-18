const express = require('express');
const router = express.Router();
const nestController = require('../controllers/nestController');

router.post('/', nestController.createNest);

module.exports = router;