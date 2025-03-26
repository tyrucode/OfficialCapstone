// function for getting the user info from spotify and saving it
export const getUserProfile = async () => {
    //saving login token
    const token = localStorage.getItem('spotify_access_token');
    //error handling
    if (!token) {
        return null;
    }
    try {
        //connecting to spotify api
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        //error handling
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        return await response.json();
    } catch (e) {
        console.log('Error fetching Spotify user profile:', e);
        return null;
    }
};