const { MongoClient, ObjectId } = require('mongodb');
const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

// import and stub before requiring the middleware
const databaseUtil = require('../util/database');
let db;
sinon.stub(databaseUtil, 'getDB').callsFake(() => db);

// now require the middleware AFTER stubbing
const isAuthMiddleware = require('../middleware/is-auth');
const optionalAuthMiddleware = require('../middleware/optional-auth');

let client;
const fakeUID = new ObjectId();

describe('Auth Middleware', function() {
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
    });


    describe('Is-Auth Middleware', function() {
      it('should respond with 401 when Authorization header is missing', async function() {
        const req = {
          header: () => null
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
    
        await isAuthMiddleware(req, res, () => {});
    
        expect(res.statusCode).to.equal(401);
        expect(res.payload).to.deep.equal({ msg: 'Not authenticated.' });
      });


      it('should respond with 500 when Authorization header is invalid(is only one string)', async function() {
        const req = {
          header: () => 'abc'
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
    
        await isAuthMiddleware(req, res, () => {});
    
        expect(res.statusCode).to.equal(500);
        expect(res.payload).to.deep.equal({ msg: 'Invalid or expired token.' });
      });

      it('should respond with 500 when Authorization header is invalid(is Bearer ...)', async function() {
        const req = {
          header: () => 'Bearer sdfghkjk'
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
    
        await isAuthMiddleware(req, res, () => {});
    
        expect(res.statusCode).to.equal(500);
        expect(res.payload).to.deep.equal({ msg: 'Invalid or expired token.' });
      });


      it('should attach a user to req if decoding the token is verified', async function() {
        const req = {
          header: () => 'Bearer ssdcfvghbnj'
        };
        
        sinon.stub(jwt, 'verify');

        jwt.verify.returns({
            user: {
                _id: fakeUID.toString()
            }
        })

        if (!databaseUtil.getDB || !databaseUtil.getDB.restore) {
            sinon.stub(databaseUtil, 'getDB').callsFake(() => db);
        }

        await isAuthMiddleware(req, {}, () => {});

        expect(req).to.have.property('user');
        expect(jwt.verify.called).to.be.true;
        
        jwt.verify.restore();
        databaseUtil.getDB.restore();
      });
    });


    describe('Optional-Auth Middleware', function() {
      it('should call next() when Authorization header is missing', async function() {
        const req = {
          header: () => null
        };

        let isNextCalled = false
    
        await optionalAuthMiddleware(req, {}, () => { isNextCalled = true });
    
        expect(isNextCalled).to.be.true;
      });


      it('should call next() when Authorization header is only one string', async function() {
        const req = {
          header: () => 'xcvbhnjk'
        };

        let isNextCalled = false
    
        await optionalAuthMiddleware(req, {}, () => { isNextCalled = true });
    
        expect(isNextCalled).to.be.true;
      });


      it('should call next() when Authorization header is holds an invalid token', async function() {
        const req = {
          header: () => 'Bearer xcvbhnjk'
        };

        let isNextCalled = false
    
        await optionalAuthMiddleware(req, {}, () => { isNextCalled = true });
    
        expect(isNextCalled).to.be.true;
      });


      it('should attach a user to req if decoding the token is verified', async function() {
        const req = {
          header: () => 'Bearer ssdcfvghbnj'
        };
        
        sinon.stub(jwt, 'verify');

        
        jwt.verify.returns({
            user: {
                _id: fakeUID.toString()
            }
        })

        sinon.stub(databaseUtil, 'getDB').callsFake(() => db);

        await optionalAuthMiddleware(req, {}, () => {});

        expect(req).to.have.property('user');
        expect(jwt.verify.called).to.be.true;
        
        jwt.verify.restore();
        databaseUtil.getDB.restore();
      });
    });


    after(async function() {
        await db.collection('users').deleteMany({});
        await client.close();
    });
});