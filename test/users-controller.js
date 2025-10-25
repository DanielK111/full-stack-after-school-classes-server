const { MongoClient, ObjectId } = require('mongodb');
const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');

let db;

const usersController = require('../controllers/users');

let client;
const fakeUID = new ObjectId();

describe('Users Controller', function() {
    before(async function() {
        client = await MongoClient.connect(
            'mongodb+srv://Dani:T7FtjBUOi8PmMqV8@cluster0.clf740k.mongodb.net/test_after_classes?retryWrites=true&w=majority&appName=Cluster0'
        );
        db = client.db();

        await db.collection('users').insertOne({
            fullname: 'Daniel K',
            email: 'test@test.com',
            password: await bcrypt.hash('test', 12),
            confirmPassword: await bcrypt.hash('test', 12),
            address: 'abc',
            city: 'xyz',
            state: 'xyz',
            zip: '123',
            phone: '1234567891',
            _id: fakeUID
        });
    });


    describe('Login', function() {
      it('should respond with 422 when either of inputs are empty', async function() {
            const req = {
              body: {
                email: '',
                password: ''
              },
              collection: {
                findOne: sinon.stub()
              }
            };
    
            const res = {
              statusCode: 0,
              payload: null,
              status(code) {
                this.statusCode = code;
                return this;
              },
              json(obj) {
                this.payload = obj;
                return this;
              }
            };
    
            await usersController.login(req, res, () => {});
    
            expect(res.statusCode).to.equal(422);
            expect(res.payload.msg).to.deep.equal('None of fields can be left empty.');
        });
        
        
        
        it('should respond with 404 when inputs are null', async function() {
            const req = {
              body: {
                email: null,
                password: null
              },
              collection: {
                findOne: sinon.stub()
              }
            };
    
            const res = {
              statusCode: 0,
              payload: null,
              status(code) {
                this.statusCode = code;
                return this;
              },
              json(obj) {
                this.payload = obj;
                return this;
              }
            };
    
            await usersController.login(req, res, () => {});
    
            expect(res.statusCode).to.equal(404);
            expect(res.payload.msg).to.deep.equal('Inputs cannot be null.');
        });

        it('should respond with 404 when inputs are undefined', async function() {
            const req = {
              body: {
                email: undefined,
                password: undefined
              },
              collection: {
                findOne: sinon.stub()
              }
            };
    
            const res = {
              statusCode: 0,
              payload: null,
              status(code) {
                this.statusCode = code;
                return this;
              },
              json(obj) {
                this.payload = obj;
                return this;
              }
            };
    
            await usersController.login(req, res, () => {});
    
            expect(res.statusCode).to.equal(404);
            expect(res.payload.msg).to.deep.equal('Inputs cannot be undefined.');
        });

        it('should respond with 404 when the user does not exist', async function() {
            const req = {
                body: {
                    email: 'test1@test.com',
                    password: 'test1'
                },
                collection: db.collection('users')
            };
        
            const res = {
                statusCode: 0,
                payload: null,
                status(code) {
                    this.statusCode = code;
                    return this;
                },
                json(obj) {
                    this.payload = obj;
                    return this;
                }
            };

            // req.collection.findOne.resolves(null);
        
            await usersController.login(req, res, () => {});
        
            expect(res.statusCode).to.equal(404);
            expect(res.payload).to.deep.equal({ msg: 'User is not registered. Incorrect email!' });
      });


      it('should respond with 200 when the user exists', async function() {
        const plainPassword = 'test';

        const req = {
            body: {
                email: 'test@test.com',
                password: plainPassword
            },
            collection: db.collection('users')
        };
    
        const res = {
          statusCode: 0,
          payload: null,
          status(code) {
            this.statusCode = code;
            return this;
          },
          json(obj) {
            this.payload = obj;
            return this;
          }
        };
    
        await usersController.login(req, res, () => {});
    
        expect(res.statusCode).to.equal(200);
        expect(res.payload.msg).to.equal('User logs in.');
      });
    });


    describe('Signup', function() {
        it('should respond with 422 when either of inputs are empty', async function() {
            const req = {
              body: {
                fullname: '',
                email: '',
                password: '',
                confirmPassword: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                phone: ''
              },
              collection: {
                findOne: sinon.stub()
              }
            };
    
            const res = {
              statusCode: 0,
              payload: null,
              status(code) {
                this.statusCode = code;
                return this;
              },
              json(obj) {
                this.payload = obj;
                return this;
              }
            };
    
            await usersController.signup(req, res, () => {});
    
            expect(res.statusCode).to.equal(422);
            expect(res.payload.msg).to.deep.equal('None of fields can be left empty.');
        });
        
        
        
        it('should respond with 404 when inputs are null', async function() {
            const req = {
              body: {
                fullname: null,
                email: null,
                password: null,
                confirmPassword: null,
                address: null,
                city: null,
                state: null,
                zip: null,
                phone: null
              },
              collection: {
                findOne: sinon.stub()
              }
            };
    
            const res = {
              statusCode: 0,
              payload: null,
              status(code) {
                this.statusCode = code;
                return this;
              },
              json(obj) {
                this.payload = obj;
                return this;
              }
            };
    
            await usersController.signup(req, res, () => {});
    
            expect(res.statusCode).to.equal(404);
            expect(res.payload.msg).to.deep.equal('Inputs cannot be null.');
        });

        it('should respond with 404 when inputs are undefined', async function() {
            const req = {
              body: {
                fullname: undefined,
                email: undefined,
                password: undefined,
                confirmPassword: undefined,
                address: undefined,
                city: undefined,
                state: undefined,
                zip: undefined,
                phone: undefined
              },
              collection: {
                findOne: sinon.stub()
              }
            };
    
            const res = {
              statusCode: 0,
              payload: null,
              status(code) {
                this.statusCode = code;
                return this;
              },
              json(obj) {
                this.payload = obj;
                return this;
              }
            };
    
            await usersController.signup(req, res, () => {});
    
            expect(res.statusCode).to.equal(404);
            expect(res.payload.msg).to.deep.equal('Inputs cannot be undefined.');
        });
        

        it('should respond with 422 when confirmPassword does not match the password value', async function() {
            const req = {
              body: {
                fullname: 'Daniel K',
                email: 'test@test.com',
                password: 'test',
                confirmPassword: 'test1',
                address: 'abc',
                city: 'xyz',
                state: 'xyz',
                zip: '123',
                phone: '123456'
              },
              collection: {
                findOne: sinon.stub()
              }
            };
    
            const res = {
              statusCode: 0,
              payload: null,
              status(code) {
                this.statusCode = code;
                return this;
              },
              json(obj) {
                this.payload = obj;
                return this;
              }
            };
    
            await usersController.signup(req, res, () => {});
    
            expect(res.statusCode).to.equal(422);
            expect(res.payload.msg).to.deep.equal("Passwords doesn't match.");
        });


        it('should respond with 422 when the user exists', async function() {
            const req = {
                body: {
                    fullname: 'Daniel K',
                    email: 'test@test.com',
                    password: 'test',
                    confirmPassword: 'test',
                    address: 'abc',
                    city: 'xyz',
                    state: 'xyz',
                    zip: '123',
                    phone: '123456'
                },
                collection: db.collection('users')
            };
        
            const res = {
                statusCode: 0,
                payload: null,
                status(code) {
                    this.statusCode = code;
                    return this;
                },
                json(obj) {
                    this.payload = obj;
                    return this;
                }
            };

            await usersController.signup(req, res, () => {});
        
            expect(res.statusCode).to.equal(422);
            expect(res.payload.msg).to.deep.equal('User already exists.');
      });


      it('should respond with 201 when the user does not exist', async function() {
        const req = {
            body: {
                fullname: 'Daniel K',
                email: 'test1@test.com',
                password: 'test',
                confirmPassword: 'test',
                address: 'abc',
                city: 'xyz',
                state: 'xyz',
                zip: '123',
                phone: '1234567891'
            },
            collection: db.collection('users')
        };
    
        const res = {
          statusCode: 0,
          payload: null,
          status(code) {
            this.statusCode = code;
            return this;
          },
          json(obj) {
            this.payload = obj;
            return this;
          }
        };
    
        await usersController.signup(req, res, () => {});
    
        expect(res.statusCode).to.equal(201);
        expect(res.payload.msg).to.equal('User created.');
      });
    })


    after(async function() {
        await db.collection('users').deleteMany({});
        await client.close();
    });
});