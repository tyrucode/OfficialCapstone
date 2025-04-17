// pages/api/list.js
import clientPromise from "../../lib/connectToDatabase";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("Guessify");
        const collection = db.collection("highscores");
        const results = await collection.find({}).toArray();
        res.status(200).json(results);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
}