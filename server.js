const http = require('http');

const mustache = require('mustache');
const dotenv = require('dotenv');

const persons = require('./data/persons').persons;
const requestController = require('./controllers/requests');


dotenv.config();

const result = mustache.render('Hi, {{fname}} {{lname}}! from mutache module', { fname: 'Daniel', lname: 'Karimi'});

console.log(`${result}\n`);

persons.forEach(person => {
    person.greet();
    console.log('Email:');
    console.log(person.email);
    console.log('Phone(s)')
    person.printNum();
    console.log();
});

// const server = http.createServer(requestController.getLessonLocation);
// const server = http.createServer(requestController.getFirstPrice);
// const server = http.createServer(requestController.getLastPrice);
const server = http.createServer(requestController.getSuffledLessons);

server.listen(process.env.PORT || 80, console.log(`Server is running on port ${process.env.PORT}`));