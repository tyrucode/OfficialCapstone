// src/pages/api/saveScore.js
export default async function handler(req, res) {
    // // Set CORS headers
    // res.setHeader('Access-Control-Allow-Credentials', true);
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    // res.setHeader(
    //     'Access-Control-Allow-Headers',
    //     'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    // );

    // // Handle OPTIONS method for preflight requests
    // if (req.method === 'OPTIONS') {
    //     res.status(200).end();
    //     return;
    // }

    // if (req.method !== 'POST') {
    //     return res.status(405).json({ error: 'Method not allowed' });
    // }

    try {
        // Import MongoDB client dynamically
        const { MongoClient } = require('mongodb');

        // Connect to MongoDB
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();

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
        await collection.insertOne(newScore);

        // Close connection
        await client.close();

        // return res.status(200).json({
        //     success: true,
        //     id: result.insertedId
        // });
    } catch (error) {
        console.error('Error saving score:', error);
        return res.status(500).json({ error: 'Failed to save score', message: error.message });
    }
}