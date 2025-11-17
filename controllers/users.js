const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email === null || password === null) {
        return res.status(404).json({ error: true, msg: "Inputs cannot be null." });
    }

    if (email === undefined || password === undefined) {
        return res.status(404).json({ error: true, msg: "Inputs cannot be undefined." });
    }

    if (email.length <= 0 || password.length <= 0) {
        return res.status(422).json({ error: true, msg: "None of fields can be left empty." });
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ error: true, msg: errors.array() });
    }

    try {
        const user = await req.collection.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User is not registered. Incorrect email!" });
        }

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
        return res.status(404).json({ msg: 'User does not exist. password is incorrect.' });

    } catch(err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
}

exports.signup = async (req, res, next) => {
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
        fullname === null || email === null || password === null || confirmPassword === null ||
        address === null || city === null || state === null || zip === null || phone === null
    ) {
        return res.status(404).json({ error: true, msg: "Inputs cannot be null." });
    }

    if (
        fullname === undefined || email === undefined || password === undefined || confirmPassword === undefined ||
        address === undefined || city === undefined || state === undefined || zip === undefined || phone === undefined
    ) {
        return res.status(404).json({ error: true, msg: "Inputs cannot be undefined." });
    }

    if (
        fullname.length <= 0 || email.length <= 0 || password.length <= 0 || confirmPassword.length <= 0 ||
        address.length <= 0 || city.length <= 0 || state.length <= 0 || zip.length <= 0 || phone.length <= 0
    ) {
        return res.status(422).json({ error: true, msg: "None of fields can be left empty." });
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ error: true, msg: errors.array() });
    }

    if (password !== confirmPassword) {
        return res.status(422).json({ error: true, msg: "Passwords doesn't match." });
    }

    const user = await req.collection.findOne({ email });

    if (user) {
        return res.status(422).json({ error: true, msg: "User already exists." });
    }

     try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await req.collection.insertOne({
      ...req.body,
      password: hashedPassword,
      confirmPassword: hashedPassword
    });

    return res.status(201).json({ error: false, msg: 'User created.', result });
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 500;
    return next(error);
  }
}