import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

// load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// get origins from enviornmental variables or allow the hard coded links.
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'https://official-capstone.vercel.app'];

// middleware
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // explicitly allow HTTP methods
    credentials: true
}));
app.use(express.json());
// Connect to MongoDB
// added retryCount / delay so we can attempt to rejoin if it doesnt connect the first time.
const connectDB = async (retryCount = 5, delay = 5000) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME
        });
        console.log('MongoDB connected');
    } catch (error) {
        // retrying connection in 5 seconds
        console.error('Error connecting to MongoDB:', error);
        console.log(`Retrying connection in ${delay / 1000} seconds...`);
        setTimeout(() => connectDB(retryCount - 1, delay), delay);
    }
};

connectDB();

// routes
app.use('/api/users', userRoutes);

// default route
app.get('/', (req, res) => {
    res.send('Guessify API is running');
});

// start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});