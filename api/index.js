const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const HighScore = require('../src/models/HighScore');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Save score endpoint
app.post('/api/saveScore', async (req, res) => {
    try {
        const { userId, username, profilePicture, score, playlistId } = req.body;

        const newScore = new HighScore({
            userId,
            username,
            profilePicture,
            score,
            playlistId
        });

        await newScore.save();

        return res.status(200).json({ success: true, id: newScore._id });
    } catch (error) {
        console.error('Error saving score:', error);
        return res.status(500).json({ error: 'Failed to save score' });
    }
});

// Get scores endpoint
app.get('/api/getScores', async (req, res) => {
    try {
        const { playlistId, userId, limit = 20, type } = req.query;

        const query = {};
        if (playlistId) query.playlistId = playlistId;
        if (userId && type === 'personal') query.userId = userId;

        const highScores = await HighScore.find(query)
            .sort({ score: -1 })
            .limit(parseInt(limit, 10));

        return res.status(200).json({ highScores });
    } catch (error) {
        console.error('Error getting scores:', error);
        return res.status(500).json({ error: 'Failed to retrieve scores' });
    }
});

// Default route for Vercel
app.all('*', (req, res) => {
    return res.status(404).json({ error: 'Route not found' });
});

// Export for Vercel
module.exports = app;