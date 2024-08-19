const express = require('express');
const router = express.Router();
const interactivityController = require('../controllers/interactivityController.js');

router.post('/slack/interactivity', interactivityController.handleInteractivity);

module.exports = router;
