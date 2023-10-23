import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import 'dotenv/config';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const productionClient = new MongoClient(process.env.MONGODB_PRODUCTION_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const productionDb = productionClient.db('wedding-site');
productionClient.connect();

const testingClient = new MongoClient(process.env.MONGODB_TESTING_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const testingDb = testingClient.db('wedding-site-testing');
testingClient.connect();

// Change this when testing
const db = testingDb;

export { db, ObjectId, testingDb, productionDb };
