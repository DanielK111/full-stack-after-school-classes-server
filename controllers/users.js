const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await req.collection.findOne({ email });
        if (user) {
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
        return res.status(404).json({ msg: 'User does not exist or password is incorrect.' });

    } catch(err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
}

exports.signup = (req, res, next) => {
    const {
        fullname,
        email,
        password,
        confirmPassword,
        address,
        city,
        state,
        zip,
        phone
     } = req.body;

     if (
        fullname.length <= 0 || email.length <= 0 || password.length <= 0 || confirmPassword.length <= 0 ||
        address.length <= 0 || city.length <= 0 || state.length <= 0 || zip.length <= 0 || phone.length <= 0
    ) {
        return res.status(422).json({ msg: "None of fields can be left empty." });
    }

    if (password !== confirmPassword) {
        return res.status(422).json({ msg: "Passwords doesn't match." });
    }

    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        req.collection.insertOne({
            ...req.body,
            password: hashedPassword,
            confirmPassword: hashedPassword
        })
        .then(result => {
            res.status(201).json({ msg: 'User created.', result });
            console.log('List of users: ');
            console.log(users);
        })
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    });
}