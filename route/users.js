const express = require('express');

const usersControllers = require('../controllers/users');

const router = express.Router();

router.post('/login', usersControllers.login);
router.post('/signup', usersControllers.signup);


module.exports = router;