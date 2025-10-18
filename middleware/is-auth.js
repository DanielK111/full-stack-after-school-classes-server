const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

module.exports = (req, res, next) => {
    const authHeader = req.header('authorization');

    if(!authHeader) {
        return res.status(401).json({ msg: 'Not authenticated.' });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.json({ msg: 'Invalid or expired token.' });
    }

    req.users = decodedToken.user;
    next();
}