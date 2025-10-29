const { MongoClient, ObjectId } = require('mongodb');
const expect = require('chai').expect;
const sinon = require('sinon');

const database = require('../util/database');

let db;

const lessonsController = require('../controllers/lessons');

let client;
const fakeUID = new ObjectId();

describe('Lessons Controller', function() {
    before(async function() {
        client = await MongoClient.connect(
            'mongodb+srv://Dani:T7FtjBUOi8PmMqV8@cluster0.clf740k.mongodb.net/test_after_classes?retryWrites=true&w=majority&appName=Cluster0'
        );
        db = client.db();

        await db.collection('users').insertOne({
            fullname: 'Daniel K',
            email: 'test@test.com',
            password: 'test',
            confirmPassword: 'test',
            address: 'abc',
            city: 'xyz',
            zip: '123',
            phone: '1234567891',
            _id: fakeUID
        });

        await db.collection('lessons').insertMany([
            {
                subject: 'Math',
                location: 'London',
                price: 100,
                space: 4,
                rating: 4,
                _id: fakeUID
            },
            {
                subject: 'Math',
                location: 'London',
                price: 50,
                space: 4,
                rating: 4,
                _id: new ObjectId()
            }
        ])
    });

    
    describe('getShuffledLessons', function() {
        it('should respond with 200 and lessons in payload has items retreived', async() => {
            const user = await db.collection('users').find().toArray();

            const req = {
                query: {},
                collection: db.collection('lessons'),
                user
            };

            const res = {
                statusCode: 0,
                payload: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(obj) {
                    this.payload = obj;
                    return this;
                }
            };

            await lessonsController.getSuffledLessons(req, res, () => {});

            expect(res.statusCode).to.equal(200);
            expect(req).to.have.property('user');
            expect(res.payload.lessons[0]).to.have.property('subject');
            expect(res.payload.user[0]).to.have.property('_id');
        })
    })


    describe('getLessonById', function() {
        it('should throw and error if no lessons are found', async() => {
            const req = {
                params: [ '66aabbccddeeff0011223344' ]
            };
            const res = {
                statusCode: 0,
                payload: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(obj) {
                    this.payload = obj;
                    return this;
                }
            };
            sinon.stub(database, 'getDB').returns(db);
            try {
                await lessonsController.getLessonById(req, res, () => {});
                throw new Error('Expected method to throw.');
            } catch (err) {
                expect(err).to.be.instanceOf(Error);
                expect(err.message).to.equal('Resouece not found');
                expect(err.statusCode).to.equal(404);
            }

            database.getDB.restore();
        })


        it('should pass with respon 200 and get back the lesson', async() => {
            const req = {
                params: [ fakeUID.toString() ]
            };
            const res = {
                statusCode: 0,
                payload: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(obj) {
                    this.payload = obj;
                    return this;
                }
            };
            sinon.stub(database, 'getDB').returns(db);
            await lessonsController.getLessonById(req, res, () => {});
            
            expect(res.statusCode).to.equal(200);
            expect(res.payload.lesson._id.toString()).to.equal(fakeUID.toString());
            

            database.getDB.restore();
        })
    })


    describe('getLessonByLocation', function() {
        it('should throw and error if no lessons are found', async() => {
            const req = {
                query: {
                    location: 'reading'
                },
                collection: db.collection('lessons')
            };
            const res = {
                statusCode: 0,
                payload: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(obj) {
                    this.payload = obj;
                    return this;
                }
            };
            sinon.stub(database, 'getDB').returns(db);
            try {
                await lessonsController.getLessonByLocation(req, res, () => {});
                throw new Error('Expected method to throw.');
            } catch (err) {
                expect(err).to.be.instanceOf(Error);
                expect(err.message).to.equal('Resouece not found');
                expect(err.statusCode).to.equal(404);
            }

            database.getDB.restore();
        })


        it('should pass with respon 200 and get back the lesson', async() => {
            const req = {
                query: {
                    location: 'london'
                },
                collection: db.collection('lessons')
            };
            const res = {
                statusCode: 0,
                payload: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(obj) {
                    this.payload = obj;
                    return this;
                }
            };
            sinon.stub(database, 'getDB').returns(db);
            await lessonsController.getLessonByLocation(req, res, () => {});
            
            expect(res.statusCode).to.equal(200);
            expect(res.payload.lesson._id.toString()).to.equal(fakeUID.toString());
            

            database.getDB.restore();
        })
    })


    describe('getFirstLessonByPrice', function() {
        it('should pass with respon 200 and get back the lesson', async() => {
            const req = {
                collection: db.collection('lessons')
            };
            const res = {
                statusCode: 0,
                payload: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(obj) {
                    this.payload = obj;
                    return this;
                }
            };
            sinon.stub(database, 'getDB').returns(db);
            const result = await lessonsController.getFirstLessonByPrice(req, res, () => {});
            console.log('Result:');
            console.log(result);

            expect(res.statusCode).to.equal(200);
            expect(res.payload.lesson._id.toString()).to.equal(fakeUID.toString());
            

            database.getDB.restore();
        })
    })


    describe('getLastLessonByPrice', function() {
        it('should pass with 200 and get back the lesson', async() => {
            const req = {
                collection: db.collection('lessons')
            };
            const res = {
                statusCode: 0,
                payload: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(obj) {
                    this.payload = obj;
                    return this;
                }
            };
            sinon.stub(database, 'getDB').returns(db);
            const result = await lessonsController.getLastLessonByPrice(req, res, () => {});
            console.log('Result:');
            console.log(result);

            expect(res.statusCode).to.equal(200);
            expect(res.payload.lesson).to.have.property('_id');
            

            database.getDB.restore();
        })
    })


    describe('postOrder', function() {
        it('should respond with 404 if request body is null', async() => {
            const req = {
                body: null
            };
            const res = {
                statusCode: 0,
                payload: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(obj) {
                    this.payload = obj;
                    return this;
                }
            };

            await lessonsController.postOrder(req, res, () => {});

            expect(res.statusCode).to.equal(404);
            expect(res.payload).to.have.property('msg', 'Request body cannot be null.');
        })

        it('should respond with 404 if request body is undefined', async() => {
            const req = {
                body: undefined
            };
            const res = {
                statusCode: 0,
                payload: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(obj) {
                    this.payload = obj;
                    return this;
                }
            };

            await lessonsController.postOrder(req, res, () => {});

            expect(res.statusCode).to.equal(404);
            expect(res.payload).to.have.property('msg', 'Request body cannot be undefined.');
        })


        it('should respond with 422 if request body is empty', async() => {
            const req = {
                body: ''
            };
            const res = {
                statusCode: 0,
                payload: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(obj) {
                    this.payload = obj;
                    return this;
                }
            };

            await lessonsController.postOrder(req, res, () => {});

            expect(res.statusCode).to.equal(422);
            expect(res.payload).to.have.property('msg', 'Request body cannot be left empty.');
        })


        it('should respond with 200 and with the message confirm order submission', async() => {
            const price = 100;
            let cart;
            let totalQuantity = 2;
            let totalPrice = totalQuantity * price;

            const req = {
                body: {
                    customer: {
                        fullname: 'Daniel K',
                        email: 'test@test.com',
                        password: 'test',
                        confirmPassword: 'test',
                        address: 'abc',
                        city: 'xyz',
                        state: 'zyz',
                        zip: '123',
                        phone: '1234567891',
                        gift: 'Do not send as gift',
                        method: 'Home'
                    },
                    order: [{
                        subject: 'Math',
                        location: 'London',
                        price: price,
                        rating: 4,
                        _id: fakeUID,
                        quantity: totalQuantity
                    }]
                },
                collection: db.collection('orders')
            };
            const res = {
                statusCode: 0,
                payload: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(obj) {
                    this.payload = obj;
                    return this;
                }
            };
            sinon.stub(database, 'getDB').returns(db);

            const result = await lessonsController.postOrder(req, res, () => {});

            console.log('Test Result:')
            console.log(result)
            expect(res.statusCode).to.equal(200);
            expect(res.payload.msg).to.equal('Order placed!');
            
            database.getDB.restore();
        })
    })


    describe('updateLesson', function() {
        it('should respond with 404 if request body or params is null', async() => {
            const req = {
                body: null,
                params: {
                    lessonId: null
                }
            };
            const res = {
                statusCode: 0,
                payload: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(obj) {
                    this.payload = obj;
                    return this;
                }
            };

            await lessonsController.updateLesson(req, res, () => {});

            expect(res.statusCode).to.equal(404);
            expect(res.payload).to.have.property('msg', 'Request body or params cannot be null.');
        })

        it('should respond with 404 if request body is undefined', async() => {
            const req = {
                body: undefined,
                params: {
                    lessonId: undefined
                }
            };
            const res = {
                statusCode: 0,
                payload: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(obj) {
                    this.payload = obj;
                    return this;
                }
            };

            await lessonsController.updateLesson(req, res, () => {});

            expect(res.statusCode).to.equal(404);
            expect(res.payload).to.have.property('msg', 'Request body or params cannot be undefined.');
        })


        it('should respond with 422 if request body is empty', async() => {
            const req = {
                body: '',
                params: {
                    lessonId: ''
                }
            };
            const res = {
                statusCode: 0,
                payload: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(obj) {
                    this.payload = obj;
                    return this;
                }
            };

            await lessonsController.updateLesson(req, res, () => {});

            expect(res.statusCode).to.equal(422);
            expect(res.payload).to.have.property('msg', 'Request body or params cannot be left empty.');
        })


        it('should respond with 200 when succeeded', async() => {
            const req = {
                body: {
                    quantity: 2,
                    space: 5
                },
                params: {
                    lessonId: fakeUID.toString()
                },
                collection: db.collection('lesssons')
            };
            const res = {
                statusCode: 0,
                payload: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(obj) {
                    this.payload = obj;
                    return this;
                }
            };
            sinon.stub(database, 'getDB').returns(db);

            const result = await lessonsController.updateLesson(req, res, () => {});

            console.log('Test Result:')
            console.log(result)
            expect(res.statusCode).to.equal(200);
            expect(res.payload.msg).to.equal('Lesson Updated!');
            
            database.getDB.restore();
        })
    })

    after(async function() {
        await db.collection('users').deleteMany({});
        await db.collection('lessons').deleteMany({});
        await db.collection('orders').deleteMany({});
        await client.close();
    });
})