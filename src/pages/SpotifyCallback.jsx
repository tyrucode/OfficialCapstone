import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/spotifyApi';
import { useUser } from '../context/UserContext';

//this will talk to spotify essentially and allow us to sign in
function SpotifyCallback() {
    const navigate = useNavigate();
    const { setUser } = useUser();
    //error handling state
    const [debugInfo, setDebugInfo] = useState({
        url: '',
        hash: '',
        parsedHash: {},
        error: null
    });

    useEffect(() => {
        //error handling state
        setDebugInfo({
            url: window.location.href,
            hash: window.location.hash,
            parsedHash: {},
            error: null
        });
        //actual callback
        const handleCallback = async () => {
            try {
                //get token info from the hash
                const hash = window.location.hash
                    //crop it at the first index
                    .substring(1)
                    //split at the symbol
                    .split('&')
                    //reduce to what we need
                    .reduce((initial, item) => {
                        if (item) {
                            const parts = item.split('=');
                            initial[parts[0]] = decodeURIComponent(parts[1]);
                        }
                        return initial;
                    }, {});

                // updating the info for error handling
                setDebugInfo(prev => ({
                    ...prev,
                    parsedHash: hash
                }));

                // clear the has from the url
                window.location.hash = '';
                //if it is correct log in and take us to game page
                if (hash.access_token) {
                    // put the token in local storage
                    localStorage.setItem('spotify_access_token', hash.access_token);

                    // amount of time local storage is going to hold this token
                    const expirationTime = new Date().getTime() + (parseInt(hash.expires_in) * 1000);
                    localStorage.setItem('spotify_token_expiration', expirationTime);

                    // get the actual profile and set it as the profile state
                    const userProfile = await getUserProfile();
                    if (userProfile) {
                        setUser(userProfile);

                        // logging in error checking
                        console.log("Authentication successful!", userProfile);

                        // take them to the game page to play
                        navigate('/game');
                    } else {
                        //error handling
                        throw new Error("Failed to get user profile");
                    }
                    //error handling
                } else if (hash.error) {
                    throw new Error(`Spotify authentication error: ${hash.error}`);
                    //error handling
                } else {
                    throw new Error("No access token found in URL");
                }
                //error handling with error handling state
            } catch (error) {
                console.error("Authentication error:", error);
                setDebugInfo(prev => ({
                    ...prev,
                    error: error.message
                }));
            }
        };
        //run the above function
        handleCallback();
    }, [navigate, setUser]);

    return (
        <div>
            <h2>Connecting to Spotify...</h2>
            {/* trying to debug using vercel */}
            {window.location.hostname !== 'localhost' && (
                <div style={{
                    margin: '20px',
                    padding: '20px',
                    border: '2px solid red',
                    color: 'white',
                }}>
                    {/* debug info */}
                    <h3>info for debugging</h3>
                    <p><strong>url currently:</strong> {debugInfo.url}</p>
                    <p><strong>current url hash:</strong> {debugInfo.hash || '[empty]'}</p>
                    <h4>hash data:</h4>
                    <p>{JSON.stringify(debugInfo.parsedHash, null, 2)}</p>
                    {/* debug info */}
                    {debugInfo.error && (
                        <div style={{ color: 'red' }}>
                            <h4>error:</h4>
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