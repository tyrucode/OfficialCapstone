// models/HighScore.js
// This isn't a true Mongoose model anymore, but a schema definition that we'll use with MongoDB

const highScoreSchema = {
    userId: String,
    username: String,
    profilePicture: String,
    score: Number,
    timestamp: { type: Date, default: Date.now },
    playlistId: String
};

export default highScoreSchema;