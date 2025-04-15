import { connectToDatabase } from "../lib/connectToDatabase";

export default async function handler(req, res) {
    try {
        const { mongoClient } = await connectToDatabase();
        const db = mongoClient.db("Guessify");
        const results = db.find({})
        response.status(200).json(results);
    } catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}