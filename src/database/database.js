
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

export default async function connectToDb() {
    if (!uri) {
        console.error('MONGODB_URI is not defined in environment variables');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }

}