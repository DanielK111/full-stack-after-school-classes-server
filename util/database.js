const path = require('path');

const propertiesReader = require('properties-reader');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const propertiesPath = path.join(__dirname, '..', 'conf' , 'db.properties');
let properties = propertiesReader(propertiesPath);

const dbPrefix = properties.get('db.prefix');
const user = encodeURIComponent(properties.get('db.user'));
const password = encodeURIComponent(properties.get('db.psw'));
const dbName = properties.get('db.dbName');
const dbUrl = properties.get('db.dbUrl');
const params = properties.get('db.params');

const uri = dbPrefix + user + ':' + password + dbUrl + params;

const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
let db;

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log('Connected to MongoDB!');
    } catch (err) {
        console.error('Cannot connect to MongoDB:', err);
    }
}

function getDb() {
    if (db) {
        return db;
    }
    throw 'No database found';
}

exports.getDB = getDb;
exports.connectToDatabase = connectToDatabase;