// pages/api/saveScore.js
import { connectToDatabase } from '../../lib/connectToDatabase';
import HighScore from '../../models/HighScore';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Connect to the database
        await connectToDatabase();

        const { userId, username, profilePicture, score, playlistId } = req.body;

        // Create a new high score
        const newScore = new HighScore({
            userId,
            username,
            profilePicture,
            score,
            playlistId
        });

        // Save to database
        await newScore.save();

        return res.status(200).json({ success: true, id: newScore._id });
    } catch (error) {
        console.error('Error saving score:', error);
        return res.status(500).json({ error: 'Failed to save score' });
    }
}