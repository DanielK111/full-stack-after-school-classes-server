const path = require('path');
const fs = require('fs');

const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

const requestRouts = require('./route/requests');


dotenv.config();

const app = express();

const createLogStream = fs.createWriteStream(
    path.join(__dirname, 'logs.log'),
    { flags: 'a' }
)

app.use(morgan('combined', { stream: createLogStream }));
app.use(express.static(path.join(__dirname, 'static')));


app.use(requestRouts);

app.use((error, req, res, next) => {
    res.status(404).send('Error: ' + error.message);
})

app.listen(process.env.PORT || 80, console.log(`Server is running on port ${process.env.PORT}`));