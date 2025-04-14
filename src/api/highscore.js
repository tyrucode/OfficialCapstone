// api/highscores.js (or similar structure for your backend)
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const HighScore = require('../models/HighScore');
const auth = require('../middleware/auth'); // Assuming you have authentication middleware

// Get top high scores
router.get('/top', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;

        const scores = await HighScore.find()
            .sort({ score: -1 }) // Sort by score in descending order
            .limit(limit);

        res.json(scores);
    } catch (error) {
        console.error('Error fetching top scores:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get current user's high scores
router.get('/user', auth, async (req, res) => {
    try {
        const userId = req.user.id; // From your auth middleware

        const scores = await HighScore.find({ userId })
            .sort({ score: -1 });

        res.json(scores);
    } catch (error) {
        console.error('Error fetching user scores:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit a new high score
router.post('/', auth, async (req, res) => {
    try {
        const { score, profilePicture } = req.body;
        const userId = req.user.id;
        const username = req.user.display_name;

        // Check if the user already has a higher score
        const existingHighScore = await HighScore.findOne({ userId })
            .sort({ score: -1 })
            .limit(1);

        if (existingHighScore && existingHighScore.score >= score) {
            return res.status(200).json({
                message: 'Existing score is higher',
                highScore: existingHighScore
            });
        }

        // If this is a new high score for the user
        const newHighScore = new HighScore({
            userId,
            username,
            profilePicture,
            score
        });

        await newHighScore.save();

        res.status(201).json(newHighScore);
    } catch (error) {
        console.error('Error submitting high score:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;