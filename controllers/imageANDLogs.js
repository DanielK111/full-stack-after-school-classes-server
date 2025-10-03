const path = require('path');
const fs = require('fs');


exports.getConsoleLogs = (req, res, next) => {
    console.log('Request URL: ' + req.url);
    console.log("Request IP: " + req.ip);
    console.log(['::ffff:127.0.0.1'].indexOf(req.ip));
    next();
}

exports.getFile = (req, res, next) => {
    const filePath = path.join(__dirname, '..', 'images', req.url);
    
    fs.stat(filePath, (err, data) => {
        if (err) {
            const error = new Error('An error occured in file system: ' + err);
            error.statusCode = 404;
            return next(error);
        }

        if(data.isFile()) {
            res.sendFile(filePath);
        } else {
            const error = new Error('File not found');
            error.statusCode = 404;
            return next(error);
        }
    })
}