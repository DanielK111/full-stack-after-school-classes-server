const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');

const usersController = require('../controllers/users');

describe('Users Controller', function() {
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

            req.collection.findOne.resolves(null);
        
            await usersController.login(req, res, () => {});
        
            expect(res.statusCode).to.equal(404);
            expect(res.payload).to.deep.equal({ msg: 'User is not registered. Incorrect email!' });
      });


      it('should respond with 200 when the user exists', async function() {
        const plainPassword = 'test1';
        const hashedPassword = await bcrypt.hash(plainPassword, 12);

        const req = {
            body: {
                email: 'test1@test.com',
                password: plainPassword
            },
            collection: {
                findOne: sinon.stub().resolves({
                    email: 'test1@test.com',
                    password: hashedPassword
                })
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
                state: 'dfghjkm,l',
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
                    state: 'dfghjkm,l',
                    zip: '123',
                    phone: '123456'
                },
                collection: {
                    findOne: sinon.stub().resolves({
                        fullname: 'Daniel K',
                        email: 'test@test.com',
                        password: 'test',
                        confirmPassword: 'test',
                        address: 'abc',
                        city: 'xyz',
                        state: 'dfghjkm,l',
                        zip: '123',
                        phone: '123456'
                    }),
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
            expect(res.payload.msg).to.deep.equal('User already exists.');
      });


      it('should respond with 201 when the user does not exist', async function() {
        const hashedPassword = await bcrypt.hash('test', 12);
        const req = {
            body: {
                fullname: 'Daniel K',
                email: 'test@test.com',
                password: 'test',
                confirmPassword: 'test',
                address: 'abc',
                city: 'xyz',
                state: 'dfghjkm,l',
                zip: '123',
                phone: '123456'
            },
            collection: {
                findOne: sinon.stub().resolves(null),
                insertOne: sinon.stub().resolves({
                    fullname: 'Daniel K',
                    email: 'test@test.com',
                    password: hashedPassword,
                    confirmPassword: hashedPassword,
                    address: 'abc',
                    city: 'xyz',
                    state: 'dfghjkm,l',
                    zip: '123',
                    phone: '123456'
                })
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
    
        expect(res.statusCode).to.equal(201);
        expect(res.payload.msg).to.equal('User created.');
      });



    })
});