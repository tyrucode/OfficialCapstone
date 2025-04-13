require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const HighScore = require('./models/HighScore');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// JWT Secret
const JWT_SECRET = 'guessify-secret-key-change-in-production';

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Generate JWT token for a user
app.post('/api/auth/token', (req, res) => {
    const { userId, username } = req.body;

    if (!userId || !username) {
        return res.status(400).json({ error: 'User ID and username are required' });
    }

    const token = jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
});

// Submit a high score
app.post('/api/highscores', authenticateToken, async (req, res) => {
    try {
        const { score, playlistId, playlistName, profilePicture } = req.body;
        const { userId, username } = req.user;

        // Convert timestamp to EST
        const timestamp = new Date();

        const highScore = new HighScore({
            userId,
            username,
            profilePicture,
            score,
            playlistId,
            playlistName,
            timestamp
        });

        await highScore.save();
        res.status(201).json(highScore);
    } catch (error) {
        console.error('Error saving high score:', error);
        res.status(500).json({ error: 'Failed to save high score' });
    }
});

// Get top high scores
app.get('/api/highscores', async (req, res) => {
    try {
        const { limit = 10, playlistId } = req.query;

        const query = playlistId ? { playlistId } : {};

        const highScores = await HighScore.find(query)
            .sort({ score: -1 })
            .limit(parseInt(limit))
            .exec();

        res.json(highScores);
    } catch (error) {
        console.error('Error getting high scores:', error);
        res.status(500).json({ error: 'Failed to get high scores' });
    }
});

// Get user's high scores
app.get('/api/highscores/user', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;

        const highScores = await HighScore.find({ userId })
            .sort({ score: -1 })
            .limit(10)
            .exec();

        res.json(highScores);
    } catch (error) {
        console.error('Error getting user high scores:', error);
        res.status(500).json({ error: 'Failed to get user high scores' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});