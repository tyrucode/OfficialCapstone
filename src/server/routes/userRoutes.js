import express from 'express';
import User from '../../models/User.js';

const router = express.Router(); //new router instance

// get all users for leaderboard (sorted by high score)
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find() // find all users in db
            .sort({ highScore: -1 }) // sort by highScore in descending order with the highest going first
            .limit(20) // limit to top 20 players
            .select('displayName highScore lastPlayed'); // only select these necessary fields

        res.json(users); //send data as json
    } catch (error) {
        //error handling
        console.error('there was a error fetching leaderboard:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// update or create user with new high score
router.post('/update-score', async (req, res) => {
    const { spotifyId, displayName, profileImage, score } = req.body; //extract data from the request body

    if (!spotifyId || !displayName) { //make sure user is allowed to be here
        return res.status(400).json({ message: 'Required fields missing' });
    }
    // Validate score is a number and not negative
    if (score === NaN || score < 0) {
        return res.status(400).json({ message: 'score must be a non negative number' });
    }
    try {
        // Find user or create if doesn't exist
        let user = await User.findOne({ spotifyId });

        if (!user) {
            // create new user if its not found
            user = new User({
                spotifyId,
                displayName,
                profileImage,
                highScore: score,
                lastPlayed: new Date()
            });
        } else {
            // update only if new score is higher
            if (score > user.highScore) {
                user.highScore = score;
            }
            user.lastPlayed = new Date(); //timestamp it
            // if the user updates pfp then change it while at it
            if (profileImage) {
                user.profileImage = profileImage;
            }
        }

        await user.save(); // save this new user to db
        res.status(200).json(user); // return updated user data
    } catch (error) {
        //error handling
        console.error('Error updating user score:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;