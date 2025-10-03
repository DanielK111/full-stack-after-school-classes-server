const express = require('express');

const requestControllers = require('../controllers/requests');

const router = express.Router();

router.use(requestControllers.getLogs);
router.use(requestControllers.getRandomDecision);
router.use(requestControllers.getFile);

module.exports = router;