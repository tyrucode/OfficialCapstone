import dotenv from 'dotenv';
import { MongoClient } from "mongodb";

//load enviornmental variables from .env
dotenv.config();

const uri = process.env.MONGODB_URI;
const options = {};

export async function connectToDatabase() {
    if (!uri) {
        console.error('MONGODB_URI is not defined in environment variables');
        return;
    }

    try {
        const client = new MongoClient(uri, options);
        console.log('Connection successful!');
        await client.connect();

    } catch (e) {
        console.error('Connection failed:', e);
    }
}