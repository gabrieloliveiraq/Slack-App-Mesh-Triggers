const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController.js')

router.post('/slack/events', eventsController.handleEvent);

module.exports = router;
