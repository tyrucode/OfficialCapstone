// src/database/database.js
import mongoose from 'mongoose';

export default async function connectToDb() {
    const uri = import.meta.env.VITE_MONGODB_URI;
    const dbName = import.meta.env.VITE_DB_NAME;

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