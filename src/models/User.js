import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    spotifyId: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    profileImage: {
        type: String
    },
    highScore: {
        type: Number,
        default: 0
    },
    lastPlayed: {
        type: Date,
        default: Date.now
    }
});

// Create or use existing model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;