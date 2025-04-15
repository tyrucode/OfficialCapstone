import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let mongoClient; //cached connection

if (!process.env.MONGODB_URI) {
    throw new Error('add uri to .env');
}

export async function connectToDatabase() {
    try {
        if (mongoClient) {
            return { mongoClient };
        }
        mongoClient = await (new MongoClient(uri, options)).connect();
        console.log('just connected');
    } catch (e) {
        console.log(e);
    }
}