// function for getting the user info from spotify and returning it
export const getUserProfile = async () => {
    //saving login token
    const token = localStorage.getItem('spotify_access_token');
    //error handling
    if (!token) {
        return null;
    }
    try {
        //connecting to spotify api using the token
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        //error handling
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        //parse and return profile data
        return await response.json();
    } catch (e) {
        //error handling
        console.log('Error fetching Spotify user profile:', e);
        return null;
    }
};