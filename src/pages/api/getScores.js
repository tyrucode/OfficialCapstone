// pages/api/getScores.js
import clientPromise from '../../lib/connectToDatabase';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get query parameters
    const { playlistId, limit = 10, type = 'all', userId } = req.query;

    try {
        const client = await clientPromise;
        const db = client.db("Guessify");
        const collection = db.collection("highscores");

        let query = {};

        // Filter by playlist if provided
        if (playlistId) {
            query.playlistId = playlistId;
        }

        // For personal best, you'd need to add userId to the query
        if (type === 'personal' && userId) {
            query.userId = userId;
        }

        // Get high scores, sorted by score (descending)
        const highScores = await collection.find(query)
            .sort({ score: -1 })
            .limit(parseInt(limit))
            .toArray();

        res.status(200).json({ success: true, highScores });
    } catch (error) {
        console.error('Error retrieving high scores:', error);
        res.status(500).json({ error: 'Failed to retrieve high scores', message: error.message });
    }
}