const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

users = [];

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        for (const user of users) {
            if (user.email === email) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    const token = jwt.sign(
                        { user },
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' }
                    );
                    return res.status(200).json({ ...user, token, msg: 'User logs in.' });
                }
            }
        }
        return res.status(404).json({ msg: 'User does not exist or password is incorrect.' });

    } catch(err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
}

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 12)
    .then(hashedPassword => {
        users.push({
            ...req.body,
            password: hashedPassword
        });
        res.status(201).json({ msg: 'User created.' });
    })
    .catch(err => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    });
}