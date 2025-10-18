const express = require('express');

const lessonsControllers = require('../controllers/lessons');
const { getDB } = require('../util/database');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


router.param('collectionName', async function(req, res, next, collectionName) {
    const db = getDB();
    req.collection = db.collection(collectionName);
    return next();
})
router.get('/:collectionName', lessonsControllers.getSuffledLessons);
router.get(/^\/lessons\/([a-fA-F0-9]{24})$/, lessonsControllers.getLessonById);
router.get('/:collectionName/location', lessonsControllers.getLessonByLocation);
router.get('/:collectionName/price/first', lessonsControllers.getFirstLessonByPrice);
router.get('/:collectionName/price/last', lessonsControllers.getLastLessonByPrice);

router.post('/lessons/add-to-cart', lessonsControllers.postLesson);
router.put('/lessons/update-cart/:lessonId', lessonsControllers.putLesson);
router.delete('/lessons/:lessonId', lessonsControllers.deleteLesson);

router.post('/:collectionName', isAuth, lessonsControllers.postOrder);
router.put('/:collectionName/:lessonId', isAuth, lessonsControllers.updateLesson);


module.exports = router;