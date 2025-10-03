const path = require('path');
const fs = require('fs');
const url = require('url');

const lodash = require('lodash');

const lessons = require('../data/lessons');


exports.getLogs = (req, res, next) => {
    console.log('Request URL: ' + req.url);
    console.log("Request IP: " + req.ip);
    console.log(['::ffff:127.0.0.1'].indexOf(req.ip));
    next();
}

exports.getLessonLocation = (req, res) => {
    const reqUrl = req.url;
    const parsedUrl = url.parse(reqUrl, true);
    const location = parsedUrl.query.location;


    // I want to create a new array and in each element (which each element 
    // is an object) and i want to only pick some of the properties

    // const locations = lodash.map(lessons.lessons, function (elm) {
    //     return lodash.pick(elm, ['location']);
    // });
    // console.log(locations)
    // const lesson = lodash.find(locations, lesson => lesson.location === location);
    const lesson = lodash.find(lessons.lessons, lesson => lesson.location === location);
    res.end(JSON.stringify(lesson));
}

exports.getFirstPrice = (req, res) => {
    // const lesson = lodash.filter(lessons.lessons, lesson => lesson.price < 100); // Returns array of lessons
    const lesson = lodash.find(lessons.lessons, lesson => lesson.price < 100);
    res.end(JSON.stringify(lesson));
}

exports.getLastPrice = (req, res) => {
    const lesson = lodash.findLast(lessons.lessons, lesson => lesson.price < 100);
    res.end(JSON.stringify(lesson));
}

exports.getSuffledLessons = (req, res) => {
    const shuffled = lodash.shuffle(lessons.lessons);
    res.end(JSON.stringify(shuffled));
}

exports.getFile = (req, res, next) => {
    const filePath = path.join(__dirname, '..', 'static', 'images', req.query.file);
    
    fs.stat(filePath, (err, data) => {
        if (err) {
            console.log(err)
            const error = new Error('An error occured in file system');
            error.statusCode = 404;
            return next(error);
        }

        if(data.isFile()) {
            res.sendFile(filePath);
        } else {
            const error = new Error('File not found');
            error.statusCode = 404;
            return next(error);
        }
    })
}