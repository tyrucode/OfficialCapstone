
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

export default async function connectToDb() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME;

    if (!uri) {
        console.error('MONGODB_URI is not defined in environment variables');
        return;
    }

    try {
        await mongoose.connect(uri, {
            dbName: dbName
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }

}