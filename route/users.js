const express = require('express');

const usersControllers = require('../controllers/users');
const { getDB } = require('../util/database');

const router = express.Router();

router.param('collectionName', async function(req, res, next, collectionName) {
    const db = getDB();
    req.collection = db.collection(collectionName);
    return next();
})

router.post('/:collectionName/login', usersControllers.login);
router.post('/:collectionName/signup', usersControllers.signup);


module.exports = router;