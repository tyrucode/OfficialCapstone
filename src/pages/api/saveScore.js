// pages/api/saveScore.js
import clientPromise from '../../lib/connectToDatabase';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const client = await clientPromise;
        const db = client.db("Guessify");
        const collection = db.collection("highscores");

        const { userId, username, profilePicture, score, playlistId } = req.body;

        // Create a new high score
        const newScore = {
            userId,
            username,
            profilePicture,
            score,
            playlistId,
            timestamp: new Date()
        };

        // Save to database
        const result = await collection.insertOne(newScore);

        return res.status(200).json({
            success: true,
            id: result.insertedId
        });
    } catch (error) {
        console.error('Error saving score:', error);
        return res.status(500).json({ error: 'Failed to save score' });
    }
}