const express = require('express');
const router = express.Router();
const shortcutsController = require('../controllers/shortcutsController.js');

router.post('/slack/shortcuts', shortcutsController.handleShortcut);

module.exports = router;
