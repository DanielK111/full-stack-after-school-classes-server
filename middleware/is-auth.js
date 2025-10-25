const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { getDB } = require('../util/database');
const { ObjectId } = require('mongodb');

dotenv.config();

module.exports = async (req, res, next) => {
    const authHeader = req.header('authorization');

    if(!authHeader) {
        return res.status(401).json({ msg: 'Not authenticated.' });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(500).json({ msg: 'Invalid or expired token.' });
    }

    if (decodedToken) {
        const db = getDB();
        const user = await db.collection('users').find({ _id: new ObjectId(decodedToken.user._id) }).toArray();
        req.user = user;
    } else {
        req.user = null;
    }
    next();
}