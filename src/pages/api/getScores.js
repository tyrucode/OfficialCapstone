import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("spotifyGameDB");

        // Get optional playlist ID from query params
        const { playlistId } = req.query;

        // Build query - filter by playlist if specified
        const query = playlistId ? { playlistId } : {};

        // Get top scores, sorted by score (descending)
        const scores = await db.collection("scores")
            .find(query)
            .sort({ score: -1 })
            .limit(10)
            .toArray();

        return res.status(200).json(scores);
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Error retrieving scores from database' });
    }
}