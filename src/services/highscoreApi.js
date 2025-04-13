// Service for high score-related API calls

// Get JWT token for the user
export const getAuthToken = async (userId, username) => {
    try {
        const response = await fetch('http://localhost:3000/api/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, username }),
        });

        if (!response.ok) {
            throw new Error('Failed to get auth token');
        }

        const data = await response.json();
        localStorage.setItem('guessify_auth_token', data.token);
        return data.token;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

// Submit a high score
export const submitHighScore = async (score, playlistId, playlistName, profilePicture) => {
    try {
        let token = localStorage.getItem('guessify_auth_token');

        if (!token) {
            // If no token exists, we need to create one using the Spotify user data
            const spotifyToken = localStorage.getItem('spotify_access_token');
            if (!spotifyToken) {
                throw new Error('Not logged in');
            }

            // Get user data from Spotify
            const userResponse = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': `Bearer ${spotifyToken}`
                }
            });

            if (!userResponse.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await userResponse.json();

            // Get auth token using Spotify user data
            token = await getAuthToken(userData.id, userData.display_name);

            if (!token) {
                throw new Error('Failed to authenticate');
            }
        }

        const response = await fetch('http://localhost:3000/api/highscores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                score,
                playlistId,
                playlistName,
                profilePicture
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to submit high score');
        }

        return await response.json();
    } catch (error) {
        console.error('Error submitting high score:', error);
        return null;
    }
};

// Get top high scores
export const getTopHighScores = async (limit = 10, playlistId = null) => {
    try {
        let url = `http://localhost:3000/api/highscores?limit=${limit}`;

        if (playlistId) {
            url += `&playlistId=${playlistId}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch high scores');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching high scores:', error);
        return [];
    }
};

// Get the current user's high scores
export const getUserHighScores = async () => {
    try {
        const token = localStorage.getItem('guessify_auth_token');

        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch('http://localhost:3000/api/highscores/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user high scores');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user high scores:', error);
        return [];
    }
};