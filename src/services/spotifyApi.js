// Function to get user profile data from Spotify
export const getUserProfile = async () => {
    const token = localStorage.getItem('spotify_access_token');

    if (!token) {
        return null;
    }

    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching Spotify user profile:', error);
        return null;
    }
};