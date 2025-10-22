const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { getDB } = require('../util/database');
const { ObjectId } = require('mongodb');

dotenv.config();

module.exports = async (req, res, next) => {
    const authHeader = req.header('authorization');

    if(!authHeader) {
        return next();
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return next();
    }

    const db = getDB();
    const user = await db.collection('users').find({ _id: new ObjectId(decodedToken.user._id) }).toArray();
    if (!user) {
        return next();
    }
    req.user = user;
    next();
}