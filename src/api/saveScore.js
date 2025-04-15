const mongoose = require('mongoose');
const HighScore = require('../../models/HighScore');

let cachedDb = null;

async function connectToDatabase(uri) {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        const client = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        cachedDb = client;
        return cachedDb;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS method
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId, username, profilePicture, score, playlistId } = req.body;

    // Validate required fields
    if (!userId || !username || score === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const uri = process.env.MONGODB_URI;
        const dbName = process.env.DB_NAME;

        if (!uri) {
            throw new Error('MONGODB_URI not defined');
        }

        await connectToDatabase(uri);
        mongoose.connection.useDb(dbName);

        // Create the high score document
        const highScore = new HighScore({
            userId,
            username,
            profilePicture: profilePicture || '',
            score,
            playlistId, // Optional field to track scores by playlist
            timestamp: new Date()
        });

        // Save to database
        await highScore.save();

        res.status(201).json({ success: true, highScore });
    } catch (error) {
        console.error('Error saving high score:', error);
        res.status(500).json({ error: 'Failed to save high score', message: error.message });
    }
}