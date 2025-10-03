const lodash = require('lodash');

const lessons = require('../data/lessons').lessons;


exports.getSuffledLessons = (req, res, next) => {
    const shuffled = lodash.shuffle(lessons);
    res.json({ lessons: shuffled });
}

exports.getLessonById = (req, res, next) => {
    const lessonId = parseInt(req.params[0], 10);
    const lesson = lodash.find(lessons, lesson => lesson.id === lessonId);
    if (lesson) {
        return res.json({ lesson })
    }
    const error = new Error('Resouece not found');
    error.statusCode = 404;
    return next(error);
}

exports.getLessonByLocation = (req, res, next) => {
    const location = req.query.location;


    // I want to create a new array and in each element (which each element 
    // is an object) and i want to only pick some of the properties

    // const locations = lodash.map(lessons, function (elm) {
    //     return lodash.pick(elm, ['location']);
    // });
    // console.log(locations)
    // const lesson = lodash.find(locations, lesson => lesson.location === location);
    const lesson = lodash.find(lessons, lesson => lesson.location.toLocaleLowerCase() === location.toLocaleLowerCase());
    res.json({ lesson });
}

exports.getFirstLessonByPrice = (req, res, next) => {
    // const lesson = lodash.filter(lessons.lessons, lesson => lesson.price < 100); // Returns array of lessons
    const lesson = lodash.find(lessons, lesson => lesson.price < 100);
    res.json({ lesson });
}

exports.getLastLessonByPrice = (req, res, next) => {
    const lesson = lodash.findLast(lessons, lesson => lesson.price < 100);
    res.json({ lesson });
}