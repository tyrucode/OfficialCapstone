import { connectToDatabase } from '../../lib/connectToDatabase';
import HighScore from '../../models/HighScore';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Ensure database connection is established
        await connectToDatabase();

        const { userId, username, profilePicture, score, playlistId } = req.body;

        // Create a new high score using the Mongoose model
        const newScore = new HighScore({
            userId,
            username,
            profilePicture,
            score,
            playlistId
        });

        // Save the new score
        await newScore.save();

        return res.status(200).json({ success: true, id: newScore._id });
    } catch (error) {
        console.error('Error saving score:', error);
        return res.status(500).json({ error: 'Failed to save score' });
    }
}