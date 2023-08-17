import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import 'dotenv/config';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const db = client.db('wedding-site');
client.connect();

export { db, ObjectId };
