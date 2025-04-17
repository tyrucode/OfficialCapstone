// src/pages/api/getScores.js
export default async function handler(req, res) {
    // Set CORS headers
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
    const { playlistId, limit = 10, type = 'all', userId } = req.query;

    try {
        // Import MongoDB client dynamically
        const { MongoClient } = require('mongodb');

        // Connect to MongoDB 
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();

        const db = client.db("Guessify");
        const collection = db.collection("highscores");

        let query = {};

        // Filter by playlist if provided
        if (playlistId) {
            query.playlistId = playlistId;
        }

        // For personal best
        if (type === 'personal' && userId) {
            query.userId = userId;
        }

        // Get high scores, sorted by score (descending)
        const highScores = await collection.find(query)
            .sort({ score: -1 })
            .limit(parseInt(limit))
            .toArray();

        // Close connection
        await client.close();

        res.status(200).json({ success: true, highScores });
    } catch (error) {
        console.error('Error retrieving high scores:', error);
        res.status(500).json({ error: 'Failed to retrieve high scores', message: error.message });
    }
}