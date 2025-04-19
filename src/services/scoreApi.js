// src/services/scoreApi.js
import connectToDb from '../database/database';
import User from '../models/User';

// Save or update user score
export const saveUserScore = async (userData, score) => {
    try {
        await connectToDb();

        const userUpdate = {
            spotifyId: userData.id,
            displayName: userData.display_name,
            lastPlayed: new Date()
        };

        // Add profile image if it exists
        if (userData.images && userData.images.length > 0) {
            userUpdate.profileImage = userData.images[0].url;
        }

        // Update user only if new score is higher than existing
        const result = await User.findOneAndUpdate(
            { spotifyId: userData.id },
            {
                ...userUpdate,
                $max: { highScore: score } // Only update if new score is higher
            },
            { new: true, upsert: true } // Create if doesn't exist, return updated doc
        );

        return result;
    } catch (error) {
        console.error('Error saving user score:', error);
        throw error;
    }
};

// Get leaderboard data
export const getLeaderboard = async (limit = 10) => {
    try {
        await connectToDb();

        // Find top users by score
        const leaderboard = await User.find()
            .sort({ highScore: -1 })
            .limit(limit);

        return leaderboard;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
};