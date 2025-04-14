// services/highscoreApi.js

export const submitHighScore = async (score, profilePicture = '') => {
    try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch('/api/highscores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({
                score,
                profilePicture
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error submitting high score:', error);
        throw error;
    }
};

export const getTopHighScores = async (limit = 20) => {
    try {
        const response = await fetch(`/api/highscores/top?limit=${limit}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching top high scores:', error);
        throw error;
    }
};

export const getUserHighScores = async () => {
    try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch('/api/highscores/user', {
            headers: {
                'x-auth-token': token
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user high scores:', error);
        throw error;
    }
};