// api/auth/spotify-callback.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    try {
        const { id, display_name, images } = req.body;

        // Create JWT payload
        const payload = {
            user: {
                id,
                display_name,
                profile_image: images && images.length > 0 ? images[0].url : ''
            }
        };

        // Sign the JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error('Error in Spotify callback:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;