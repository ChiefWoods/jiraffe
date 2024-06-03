import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

export const client = new MongoClient(process.env.MONGODB_URI);

await client.connect()
  .then(() => console.log("Connected to database"))
  .catch(err => console.error(err));

