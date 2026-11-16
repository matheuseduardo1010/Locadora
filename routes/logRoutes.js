const express = require('express');
const router = express.Router();
const listarLogs = require('../controllers/listarLogs');

router.get('/', listarLogs);

module.exports = router;
