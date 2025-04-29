import mongoose from 'mongoose';
//schema for the user data we will be saving
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
}, { timestamps: true }); // added timestamps option for automatic createdAt and updatedAt fields


// create/retrieve the user model and if it doesnt exist create a new one
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;