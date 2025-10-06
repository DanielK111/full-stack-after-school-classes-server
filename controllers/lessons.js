const lodash = require('lodash');
const { getDB } = require('../util/database');

const states = require('../data/states').states;

let cart = [];
let totalQuantity = 0;
const myOrder = [];

exports.getSuffledLessons = async (req, res, next) => {
    const lessons = await req.collection.find().toArray();
    const shuffled = lodash.shuffle(lessons);
    res.json({
        lessons: shuffled,
        states: states,
        cart,
        totalQuantity,
        myOrder
    });
}

exports.getLessonById = async (req, res, next) => {
    const lessonId = parseInt(req.params[0], 10);
    const db = getDB();
    // I can just search mongodb for specific id but I wanted to show I know lodash
    // This way return value is an object(lesson with id === lessonId)
    // const lesson = await db.collection('lessons').findOne({ id: lessonId });
    const lessons = await db.collection('lessons').find().toArray();
    const lesson = lodash.find(lessons, lesson => lesson.id === lessonId);
    if (lesson) {
        return res.json({ lesson })
    }
    const error = new Error('Resouece not found');
    error.statusCode = 404;
    return next(error);
}

exports.getLessonByLocation = async (req, res, next) => {
    const location = req.query.location;


    // I want to create a new array and in each element (which each element 
    // is an object) and i want to only pick some of the properties

    // const locations = lodash.map(lessons, function (elm) {
    //     return lodash.pick(elm, ['location']);
    // });
    // console.log(locations)
    // const lesson = lodash.find(locations, lesson => lesson.location === location);
    const lessons = await req.collection.find().toArray();
    const lesson = lodash.find(lessons, lesson => lesson.location.toLocaleLowerCase() === location.toLocaleLowerCase());
    res.json({ lesson });
}

exports.getFirstLessonByPrice = async (req, res, next) => {
    // const lesson = lodash.filter(lessons.lessons, lesson => lesson.price < 100); // Returns array of lessons
    const lessons = await req.collection.find().toArray();
    const lesson = lodash.find(lessons, lesson => lesson.price < 100);
    res.json({ lesson });
}

exports.getLastLessonByPrice = async (req, res, next) => {
    const lessons = await req.collection.find().toArray();
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

exports.postOrder = async (req, res, next) => {
    const body = req.body;
    req.collection.insertOne(body)
    .then(result => {
        myOrder.push(body);
        const db = getDB();
        cart.forEach(l => {
            db.collection('lessons').updateOne(
                { id: l.id },
                { $set: { space: l.space - l.quantity } }
            )
        });
        cart = [];
        totalQuantity = 0;
        for(const p of myOrder)
            console.log(p);
        console.log(myOrder.length);
    
        return res.json({ myOrder, cart, totalQuantity, msg: 'Order placed!' });
    })
}