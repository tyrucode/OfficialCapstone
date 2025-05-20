// change api depending on enviornment for error handling
const API_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api'
    : 'https://official-capstone.vercel.app/api';// production

// save user score to db
export const saveUserScore = async (userData) => {
    try {
        //sending score to the db and convert it to a json string
        const response = await fetch(`${API_URL}/users/update-score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        //check if response was a success if not error
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        //parse and return json response
        return await response.json();
    } catch (error) {
        //error handling
        console.error('Error saving score:', error);
        throw error;
    }
};

// get leaderboard data
export const getLeaderboard = async () => {
    try {
        const response = await fetch(`${API_URL}/users/leaderboard`); //get request for the leaderboard
        //check if response was good if not then error handle
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        //parse/return response with json data for leaderboard
        return await response.json();
    } catch (error) {
        //error handling 
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
};