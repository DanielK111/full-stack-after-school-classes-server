const express = require('express');

const lessonsControllers = require('../controllers/lessons');

const router = express.Router();


router.get('/lessons', lessonsControllers.getSuffledLessons);
router.get(/^\/lessons\/(\d+)$/, lessonsControllers.getLessonById);
router.get('/lessons/location', lessonsControllers.getLessonByLocation);
router.get('/lessons/price/first', lessonsControllers.getFirstLessonByPrice);
router.get('/lessons/price/last', lessonsControllers.getLastLessonByPrice);


module.exports = router;