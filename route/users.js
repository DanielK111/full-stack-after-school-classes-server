const express = require('express');
const { body } = require('express-validator');

const usersControllers = require('../controllers/users');
const { getDB } = require('../util/database');

const router = express.Router();

router.param('collectionName', async function(req, res, next, collectionName) {
    const db = getDB();
    req.collection = db.collection(collectionName);
    return next();
})

router.post('/:collectionName/login',
    [
        body('email')
        .isEmail()
        .withMessage('Please Enter a valid E-Mail.')
        .custom((values, { req }) => {
            return db.collection('users').findOne({ email: value })
            .then(user => {
                if(!user) {
                    return Promise.reject('E-Mail exists already. Please pick a different one.')
                }
            })
        })
        .normalizeEmail(),
        body('password')
        .isLength({min: 8, max: 16})
        .withMessage('Password must be between 8 and 16 characters long.')
        .trim()
    ],
    usersControllers.login
);
router.post('/:collectionName/signup',
    [
        body('fullname')
        .matches(/^[a-zA-Z]{4,} [a-zA-Z]{4,}$/)
        .withMessage('Fullname must be at least 9 characters long.')
        .trim(),
        body('email')
        .isEmail()
        .withMessage('Please Enter a valid E-Mail.')
        .custom((values, { req }) => {
            return db.collection('users').findOne({ email: value })
            .then(user => {
                if(!user) {
                    return Promise.reject('E-Mail exists already. Please pick a different one.')
                }
            })
        })
        .normalizeEmail(),
        body('phone')
        .matches(/^[0-9]{10}$/)
        .withMessage('Please enter a valid phone number')
        .trim(),
        body('password')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be between 8 and 16 characters long.')
        .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
        .withMessage('Password must include at least one lowercase letter, one uppercase letter, one number, one special character, and no spaces.')
        .trim(),
        body('confirmPassword')
        .custom((value, { req }) => {
            if(value != req.body.password) {
                throw new Error('Passwords must match.')
            }
        })
        .trim()
    ],
    usersControllers.signup
);


module.exports = router;