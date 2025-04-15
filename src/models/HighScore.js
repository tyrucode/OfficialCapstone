const mongoose = require('mongoose');

const highScoreSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: '',
    },
    score: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    playlistId: {
        type: String,
        default: ''
    }
});

// Index for efficiently retrieving top scores
highScoreSchema.index({ score: -1 });

const HighScore = mongoose.model('HighScore', highScoreSchema);

module.exports = HighScore;