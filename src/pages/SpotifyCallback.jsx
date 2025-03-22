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
        // For debugging purposes
        setDebugInfo({
            url: window.location.href,
            hash: window.location.hash,
            parsedHash: {},
            error: null
        });

        const handleCallback = async () => {
            try {
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

                // Update debug info
                setDebugInfo(prev => ({
                    ...prev,
                    parsedHash: hash
                }));

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

                        // Log success
                        console.log("Authentication successful!", userProfile);

                        // Redirect to the game page
                        navigate('/game');
                    } else {
                        throw new Error("Failed to get user profile");
                    }
                } else if (hash.error) {
                    throw new Error(`Spotify authentication error: ${hash.error}`);
                } else {
                    throw new Error("No access token found in URL");
                }
            } catch (error) {
                console.error("Authentication error:", error);
                setDebugInfo(prev => ({
                    ...prev,
                    error: error.message
                }));

                // Don't redirect automatically on error to see debug info
                // navigate('/');
            }
        };

        handleCallback();
    }, [navigate, setUser]);

    return (
        <div>
            <h2>Connecting to Spotify...</h2>

            {/* Debug information - only show on Vercel */}
            {window.location.hostname !== 'localhost' && (
                <div style={{
                    margin: '20px',
                    padding: '20px',
                    border: '2px solid red',
                    backgroundColor: '#333',
                    color: 'white',
                    fontFamily: 'monospace'
                }}>
                    <h3>Debug Information</h3>
                    <p><strong>Current URL:</strong> {debugInfo.url}</p>
                    <p><strong>URL Hash:</strong> {debugInfo.hash || '[empty]'}</p>

                    <h4>Parsed Hash Data:</h4>
                    <pre>{JSON.stringify(debugInfo.parsedHash, null, 2)}</pre>

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