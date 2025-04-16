import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

async function handler(req, res) {
    try {
        const db = await (new MongoClient(uri, options)).connect();
        console.log('Connection successful!');

        const collection = db.collection.db.listCollections().toArray();
        console.log('Collections in database:', collection.map(c => c.name));

        await db.disconnect();
    } catch (e) {
        console.error('connection failed :', e)
    }
}

handler();