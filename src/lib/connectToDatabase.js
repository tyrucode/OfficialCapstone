import dotenv from 'dotenv';
import { MongoClient } from "mongodb";

// Load environmental variables from .env
dotenv.config();

const uri = process.env.MONGODB_URI;
const options = {};

// Global client reference to maintain connection across function calls
let client = null;
let dbInstance = null;

export async function connectToDatabase() {
    if (!uri) {
        console.error('MONGODB_URI is not defined in environment variables');
        return null;
    }

    // If we already have a connection, return it
    if (client && dbInstance) {
        return { client, db: dbInstance };
    }

    try {
        client = new MongoClient(uri, options);
        await client.connect();
        dbInstance = client.db(); // Store the database instance
        console.log('Database connection successful!');
        return { client, db: dbInstance };
    } catch (e) {
        console.error('Database connection failed:', e);
        return null;
    }
}

// Export the client and db for direct access if needed
export { client, dbInstance as db };