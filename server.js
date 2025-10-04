const path = require('path');
const fs = require('fs');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const imageANDLogsControllers = require('./controllers/imageANDLogs');
const imageANDLogsRoutes = require('./route/imageANDLogs');
const lessonsRoutes = require('./route/lessons');


dotenv.config();

const app = express();
app.set('json spaces', 3);
app.use(cors());
app.use(express.json());

const createLogStream = fs.createWriteStream(
    path.join(__dirname, 'logs.log'),
    { flags: 'a' }
)

app.use(morgan('combined', { stream: createLogStream }));
app.use('/puclic', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use(imageANDLogsControllers.getConsoleLogs);
app.use(imageANDLogsRoutes);
app.use('/api', lessonsRoutes);

app.use((error, req, res, next) => {
    res.status(404).send('Error: ' + error.message);
})

app.listen(process.env.PORT || 80, console.log(`Server is running on port ${process.env.PORT}`));