const express = require('express');
const { getDB } = require('../util/database');

const imageANDLogsControllers = require('../controllers/imageANDLogs');

const router = express.Router();


router.param('collectionName', async function(req, res, next, collectionName) {
    const db = getDB();
    req.collection = db.collection(collectionName);
    return next();
});
router.get('/collections/:collectionName', imageANDLogsControllers.getConsoleLogsWithCollectionName);
router.get('/images/:filename', imageANDLogsControllers.getFile);


module.exports = router;