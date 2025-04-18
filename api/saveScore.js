import clientPromise from "../src/lib/mongodb";

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const client = await clientPromise;
        const db = client.db("spotifyGameDB");

        // Get score data from request body
        const { username, score, playlistId, playlistName } = req.body;

        // Validate required fields
        if (!username || score === undefined) {
            return res.status(400).json({ message: 'Username and score are required' });
        }

        // Create score document with timestamp
        const scoreDoc = {
            username,
            score,
            playlistId,
            playlistName,
            createdAt: new Date()
        };

        // Insert score into database
        const result = await db.collection("scores").insertOne(scoreDoc);

        return res.status(200).json({
            message: 'Score saved successfully',
            id: result.insertedId
        });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Error saving score to database' });
    }
}