import dotenv from 'dotenv';
import { MongoClient } from "mongodb";

//load enviornmental variables from .env
dotenv.config();

const uri = process.env.MONGODB_URI;
const options = {};

async function handler() {
    if (!uri) {
        console.error('MONGODB_URI is not defined in environment variables');
        return;
    }

    try {
        const client = new MongoClient(uri, options);
        const db = await client.connect();
        console.log('Connection successful!');

        const collections = await client.db().listCollections().toArray();
        console.log('Collections in database:', collections.map(c => c.name));

        await client.close();
    } catch (e) {
        console.error('Connection failed:', e);
    }
}

handler();