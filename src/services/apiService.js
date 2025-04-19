// Base API URL - adjust based on your environment
const API_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api'
    : '/api';// In production, the API will be under the same domain

// Save user score
export const saveUserScore = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/users/update-score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving score:', error);
        throw error;
    }
};

// Get leaderboard data
export const getLeaderboard = async () => {
    try {
        const response = await fetch(`${API_URL}/users/leaderboard`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
};