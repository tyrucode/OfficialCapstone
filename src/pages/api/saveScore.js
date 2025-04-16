import { connectToDatabase } from '../../lib/connectToDatabase';
const mongoose = require('mongoose');
const HighScore = require('../../models/HighScore');

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS method
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId, username, profilePicture, score, playlistId } = req.body;

    // Validate required fields
    if (!userId || !username || score === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const { db } = await connectToDatabase();

        // Make sure the HighScore model is registered with this db connection
        let HighScoreModel;
        try {
            HighScoreModel = mongoose.model('HighScore');
        } catch (e) {
            HighScoreModel = mongoose.model('HighScore', HighScore.schema);
        }

        // Create the high score document
        const highScore = new HighScoreModel({
            userId,
            username,
            profilePicture: profilePicture || '',
            score,
            playlistId, // Optional field to track scores by playlist
            timestamp: new Date()
        });

        // Save to database
        await highScore.save();

        res.status(201).json({ success: true, highScore });
    } catch (error) {
        console.error('Error saving high score:', error);
        res.status(500).json({ error: 'Failed to save high score', message: error.message });
    }
}