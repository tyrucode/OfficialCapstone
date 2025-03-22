import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/spotifyApi';
import { useUser } from '../context/UserContext';

function SpotifyCallback() {
    const navigate = useNavigate();
    const { setUser } = useUser();

    useEffect(() => {
        const handleCallback = async () => {
            // Extract token info from the URL hash
            const hash = window.location.hash
                .substring(1)
                .split('&')
                .reduce((initial, item) => {
                    if (item) {
                        const parts = item.split('=');
                        initial[parts[0]] = decodeURIComponent(parts[1]);
                    }
                    return initial;
                }, {});

            // Clear the hash from the URL
            window.location.hash = '';

            if (hash.access_token) {
                // Store the token in localStorage
                localStorage.setItem('spotify_access_token', hash.access_token);

                // Calculate expiration time
                const expirationTime = new Date().getTime() + (parseInt(hash.expires_in) * 1000);
                localStorage.setItem('spotify_token_expiration', expirationTime);

                // Fetch user profile
                const userProfile = await getUserProfile();
                if (userProfile) {
                    setUser(userProfile);
                }

                // Redirect to the game page
                navigate('/game');
            } else {
                // If there's an error, redirect to home
                navigate('/');
            }
        };

        handleCallback();
    }, [navigate, setUser]);

    return (
        <div>
            <h2>Connecting to Spotify...</h2>
        </div>
    );
}

export default SpotifyCallback;