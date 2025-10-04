const express = require('express');

const lessonsControllers = require('../controllers/lessons');

const router = express.Router();


router.get('/lessons', lessonsControllers.getSuffledLessons);
router.get(/^\/lessons\/(\d+)$/, lessonsControllers.getLessonById);
router.get('/lessons/location', lessonsControllers.getLessonByLocation);
router.get('/lessons/price/first', lessonsControllers.getFirstLessonByPrice);
router.get('/lessons/price/last', lessonsControllers.getLastLessonByPrice);

router.post('/lessons', lessonsControllers.postLesson);
router.put('/lessons/:lessonId', lessonsControllers.putLesson);
router.delete('/lessons/:lessonId', lessonsControllers.deleteLesson);

router.post('/orders', lessonsControllers.postOrder);


module.exports = router;