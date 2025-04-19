import express from 'express';
import User from '../../models/User.js';

const router = express.Router();

// Get all users for leaderboard (sorted by high score)
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find()
            .sort({ highScore: -1 }) // Sort by highScore in descending order
            .limit(20) // Limit to top 20 players
            .select('displayName highScore lastPlayed'); // Only select necessary fields

        res.json(users);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update or create user with new high score
router.post('/update-score', async (req, res) => {
    const { spotifyId, displayName, profileImage, score } = req.body;

    if (!spotifyId || !displayName) {
        return res.status(400).json({ message: 'Required fields missing' });
    }

    try {
        // Find user or create if doesn't exist
        let user = await User.findOne({ spotifyId });

        if (!user) {
            // Create new user
            user = new User({
                spotifyId,
                displayName,
                profileImage,
                highScore: score,
                lastPlayed: new Date()
            });
        } else {
            // Update only if new score is higher
            if (score > user.highScore) {
                user.highScore = score;
            }
            user.lastPlayed = new Date();
            // Update profile image if provided
            if (profileImage) {
                user.profileImage = profileImage;
            }
        }

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user score:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;