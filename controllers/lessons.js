const lodash = require('lodash');

const lessons = require('../data/lessons').lessons;
const states = require('../data/states').states;

let cart = [];
let totalQuantity = 0;
const myOrder = [];

exports.getSuffledLessons = (req, res, next) => {
    const shuffled = lodash.shuffle(lessons);
    res.json({
        lessons: shuffled,
        states: states,
        cart,
        totalQuantity,
        myOrder
    });
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

exports.postLesson = (req, res, next) => {
    const lesson = req.body.lesson;
    let itemCount = 1;
    cart.push({ ...lesson, quantity: itemCount });

    totalQuantity += 1;

    console.log(cart)

    res.json({ cart, totalQuantity });
}

exports.putLesson = (req, res, next) => {
    const lessonId = parseInt(req.params.lessonId);
    const cartProductIndex = cart.findIndex(l => l.id === lessonId);
    let itemCount = 1;
    const items = [ ...cart ];
    

    itemCount = items[cartProductIndex].quantity + itemCount;
    cart[cartProductIndex].quantity = itemCount;

    totalQuantity += 1;

    console.log(cart)

    res.json({ cart, totalQuantity, msg: 'Updated Succcessfully!' });
}

exports.deleteLesson = (req, res, next) => {
    const lessonId = parseInt(req.params.lessonId);
    const cartProduct = cart.find(p => p.id === lessonId);
    if (cartProduct.quantity > 1) {
        cartProduct.quantity -= 1;
    } else {
        cart = cart.filter(p => p.id !== lessonId);
    }
    
    totalQuantity -= 1;
    if (totalQuantity < 0)
        totalQuantity = 0


    console.log(cart)

    res.json({ cart, totalQuantity, msg: 'Deleted Succcessfully!' });
}

exports.postOrder = (req, res, next) => {
    const body = req.body;
    console.log(body)
    myOrder.push(body);
    cart = [];
    totalQuantity = 0;
    for(const p of myOrder)
        console.log(p);
    console.log(myOrder.length);
    res.json({ myOrder, cart, totalQuantity, msg: 'Order placed!' });
}