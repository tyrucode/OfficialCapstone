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

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get query parameters
    const { playlistId, limit = 10, type = 'all' } = req.query;

    try {
        const uri = process.env.MONGODB_URI;
        const dbName = process.env.DB_NAME;

        if (!uri) {
            throw new Error('MONGODB_URI not defined');
        }

        // If we're running in Vercel, we need to use the connection approach
        // If we're running in Express, we can use the existing connection
        if (!mongoose.connection || mongoose.connection.readyState !== 1) {
            await connectToDatabase(uri);
        }

        // Use the correct database
        const db = mongoose.connection.useDb(dbName, { useCache: true });

        // Make sure the HighScore model is registered with this db connection
        const HighScoreModel = db.model('HighScore', HighScore.schema);

        let query = {};

        // Filter by playlist if provided
        if (playlistId) {
            query.playlistId = playlistId;
        }

        // For personal best, you'd need to add userId to the query
        if (type === 'personal' && req.query.userId) {
            query.userId = req.query.userId;
        }

        // Get high scores, sorted by score (descending)
        const highScores = await HighScoreModel.find(query)
            .sort({ score: -1 })
            .limit(parseInt(limit))
            .exec();

        res.status(200).json({ success: true, highScores });
    } catch (error) {
        console.error('Error retrieving high scores:', error);
        res.status(500).json({ error: 'Failed to retrieve high scores', message: error.message });
    }
}