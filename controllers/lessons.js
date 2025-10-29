const lodash = require('lodash');
const { ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const Resend = require('resend').Resend;

const database = require('../util/database');
const states = require('../data/states').states;

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

let cart = [];
let totalQuantity = 0;
let totalPrice = 0;
const myOrder = [];

exports.getSuffledLessons = async (req, res, next) => {
    const searchText = req.query.search;
    // console.log(searchText)
    let lessons;

    if (searchText) {
        // Perform search with query
        const searchNum = Number(searchText);

        const query = {
            $or: [
                { subject: { $regex: searchText, $options: 'i' } },
                { location: { $regex: searchText, $options: 'i' } },
                ...isNaN(searchNum) ? [] : [{ space: searchNum }]
            ]
        };
        lessons = await req.collection.find(query).toArray();
    } else {
        lessons = await req.collection.find().toArray();
    }
    const shuffled = lodash.shuffle(lessons);
    return res.status(200).json({
        lessons: shuffled,
        states: states,
        cart,
        totalQuantity,
        totalPrice,
        myOrder,
        user: req.user || []
    });
}

exports.getLessonById = async (req, res, next) => {
    const lessonId = req.params[0];
    const db = database.getDB();
    // I can just search mongodb for specific id but I wanted to show I know lodash
    // This way return value is an object(lesson with _id === lessonId)
    // const lesson = await db.collection('lessons').findOne({ _id: new ObjectId(lessonId) });
    const lessons = await db.collection('lessons').find().toArray();
    const lesson = lodash.find(lessons, lesson => lesson._id.toString() === lessonId);
    if (lesson) {
        return res.status(200).json({ lesson })
    }
    const error = new Error('Resouece not found');
    error.statusCode = 404;
    throw error;
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
    if (lesson) {
        return res.status(200).json({ lesson })
    }
    const error = new Error('Resouece not found');
    error.statusCode = 404;
    throw error;
}

exports.getFirstLessonByPrice = async (req, res, next) => {
    // const lesson = lodash.filter(lessons.lessons, lesson => lesson.price < 100); // Returns array of lessons
    const lessons = await req.collection.find().toArray();
    const lesson = lodash.find(lessons, lesson => lesson.price <= 100);
    if (lesson) {
        return res.status(200).json({ lesson })
    }
    const error = new Error('Resouece not found');
    error.statusCode = 404;
    throw error;
}

exports.getLastLessonByPrice = async (req, res, next) => {
    const lessons = await req.collection.find().toArray();
    const lesson = lodash.findLast(lessons, lesson => lesson.price <= 100);
    if (lesson) {
        return res.status(200).json({ lesson })
    }
    const error = new Error('Resouece not found');
    error.statusCode = 404;
    throw error;
}

exports.postLesson = (req, res, next) => {
    const lesson = req.body.lesson;
    let itemCount = 1;
    totalPrice += lesson.price;
    cart.push({ ...lesson, quantity: itemCount });

    totalQuantity += 1;

    console.log(cart)

    return res.status(200).json({ cart, totalQuantity, totalPrice });
}

exports.putLesson = (req, res, next) => {
    const lessonId = req.params.lessonId;
    const cartProductIndex = cart.findIndex(l => l._id === lessonId);
    const lesson = cart[cartProductIndex];
    let itemCount = 1;
    totalPrice += lesson.price;
    const items = [ ...cart ];
    

    itemCount = items[cartProductIndex].quantity + itemCount;
    cart[cartProductIndex].quantity = itemCount;

    totalQuantity += 1;

    console.log(cart)

    return res(200).json({ cart, totalQuantity, totalPrice, msg: 'Updated Succcessfully!' });
}

exports.deleteLesson = (req, res, next) => {
    const lessonId = req.params.lessonId;
    const cartProduct = cart.find(p => p._id === lessonId);

    if (cartProduct.quantity > 1) {
        cartProduct.quantity -= 1;
    } else {
        cart = cart.filter(p => p._id !== lessonId);
    }
    
    totalQuantity -= 1;
    totalPrice -= cartProduct.price;
    if (totalQuantity < 0)
        totalQuantity = 0


    console.log(cart)

    return res(200).json({ cart, totalQuantity, totalPrice, msg: 'Deleted Succcessfully!' });
}

exports.postOrder = async (req, res, next) => {
    const body = req.body;
    if (body === null) {
        return res.status(404).json({ error: true, msg: "Request body cannot be null." });
    }

    if (body === undefined) {
        return res.status(404).json({ error: true, msg: "Request body cannot be undefined." });
    }

    if (body.length <= 0) {
        return res.status(422).json({ error: true, msg: "Request body cannot be left empty." });
    }

    await req.collection.insertOne({ ...body, totalPrice });
    
    myOrder.push(body);
    cart = [];
    totalQuantity = 0;
    totalPrice = 0;
    console.log(myOrder);
    console.log(myOrder.length);
    
    
    function orderHtml() {
        const rows = body.order.map(order => `
            <tr>
                <td>${ order._id }</td>
                <td>${ order.subject }</td>
                <td>${ order.location }</td>
                <td>${ order.price }</td>
                <td>${ order.rating }</td>
                <td>${ order.quantity }</td>
            </tr>
        `).join('');

        return `
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Subject</th>
                        <th>Location</th>
                        <th>Price</th>
                        <th>Rating</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `
    }

    const resendOrderHtml = orderHtml(body.order);

    resend.emails.send({
        to: [ body.customer.email ],
        from: 'After School Classes Team <onboarding@resend.dev>',
        subject: 'Order Submitted',
        html: `
            <h2>Customer:</h2>
            <p><span>Full Name: </span>${body.customer.fullname}</p>
            <p><span>Email Address: </span>${body.customer.email}</p>
            <p><span>Address: </span>${body.customer.address}</p>
            <p><span>City: </span>${body.customer.city}</p>
            <p><span>State: </span>${body.customer.state}</p>
            <p><span>Zip: </span>${body.customer.zip}</p>
            <p><span>Phone: </span>${body.customer.phone}</p>
            <p><span>Gift: </span>${body.customer.gift}</p>
            <p><span>Method: </span>${body.customer.method}</p>
            <h2>Order:</h2>
            ${resendOrderHtml}
        `
    });

    return res.status(200).json({ myOrder, cart, totalQuantity, totalPrice, msg: 'Order placed!' });  
}

exports.updateLesson = async (req, res, next) => {
    const lessonId = req.params.lessonId;
    const body = req.body;

    if (body === null || lessonId === null) {
        return res.status(404).json({ error: true, msg: "Request body or params cannot be null." });
    }

    if (body === undefined || lessonId === undefined) {
        return res.status(404).json({ error: true, msg: "Request body or params cannot be undefined." });
    }

    if (body.length <= 0 || lessonId.length <= 0) {
        return res.status(422).json({ error: true, msg: "Request body or params cannot be left empty." });
    }

    await req.collection.updateOne(
        { _id: new ObjectId(lessonId) },
        { $set: { space: body.space - body.quantity } }
    )
    
    return res.status(200).json({ msg: 'Lesson Updated!' });
}