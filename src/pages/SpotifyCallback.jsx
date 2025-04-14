import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/spotifyApi';
import { useUser } from '../context/UserContext';

function SpotifyCallback() {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [debugInfo, setDebugInfo] = useState({
        url: '',
        hash: '',
        parsedHash: {},
        error: null
    });

    useEffect(() => {
        setDebugInfo({
            url: window.location.href,
            hash: window.location.hash,
            parsedHash: {},
            error: null
        });

        const handleCallback = async () => {
            try {
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

                setDebugInfo(prev => ({
                    ...prev,
                    parsedHash: hash
                }));

                window.location.hash = '';

                if (hash.access_token) {
                    // Store Spotify access token
                    localStorage.setItem('spotify_access_token', hash.access_token);
                    const expirationTime = new Date().getTime() + (parseInt(hash.expires_in) * 1000);
                    localStorage.setItem('spotify_token_expiration', expirationTime);

                    // Get user profile from Spotify
                    const userProfile = await getUserProfile();
                    if (userProfile) {
                        setUser(userProfile);

                        // Get JWT token from your backend
                        try {
                            const response = await fetch('/api/auth/spotify-callback', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(userProfile)
                            });

                            if (response.ok) {
                                const { token } = await response.json();
                                localStorage.setItem('jwt_token', token);
                            } else {
                                console.error('Failed to get JWT token');
                            }
                        } catch (tokenError) {
                            console.error('Error getting JWT token:', tokenError);
                        }

                        console.log("Auth successful", userProfile);
                        navigate('/game');
                    } else {
                        throw new Error("Failed to get user profile");
                    }
                } else if (hash.error) {
                    throw new Error(`Spotify auth error: ${hash.error}`);
                } else {
                    throw new Error("No access token in URL");
                }
            } catch (error) {
                console.error("Auth error:", error);
                setDebugInfo(prev => ({
                    ...prev,
                    error: error.message
                }));
            }
        };

        handleCallback();
    }, [navigate, setUser]);

    return (
        <div>
            <h2>Connecting to Spotify...</h2>
            {window.location.hostname !== 'localhost' && (
                <div style={{
                    margin: '20px',
                    padding: '20px',
                    border: '2px solid red',
                    color: 'white',
                }}>
                    <h3>Info for debugging</h3>
                    <p><strong>URL currently:</strong> {debugInfo.url}</p>
                    <p><strong>Current URL hash:</strong> {debugInfo.hash || '[empty]'}</p>
                    <h4>Hash data:</h4>
                    <p>{JSON.stringify(debugInfo.parsedHash, null, 2)}</p>
                    {debugInfo.error && (
                        <div style={{ color: 'red' }}>
                            <h4>Error:</h4>
                            <p>{debugInfo.error}</p>
                        </div>
                    )}
                    <div style={{ marginTop: '20px' }}>
                        <button onClick={() => navigate('/')}>
                            Go Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SpotifyCallback;