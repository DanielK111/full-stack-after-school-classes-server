const express = require('express');

const imageANDLogsControllers = require('../controllers/imageANDLogs');

const router = express.Router();


router.get('/images/:filename', imageANDLogsControllers.getFile);


module.exports = router;