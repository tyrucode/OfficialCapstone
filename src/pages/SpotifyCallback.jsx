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
                //get token info from the hash in the url
                const hash = window.location.hash
                    //get rid of the hashtag at the first index
                    .substring(1)
                    //split at the & symbol
                    .split('&')
                    //reduce into objects for what we need
                    .reduce((initial, item) => {
                        //making our object key values be - item : decodedKey, and return that value
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

                // clear the hash from the url
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
                        console.log("auth successful", userProfile);

                        // take them to the game page to play
                        navigate('/game');
                    } else {
                        //error handling
                        throw new Error("failing to get the users profile");
                    }
                    //error handling
                } else if (hash.error) {
                    throw new Error(`spotify auth error: ${hash.error}`);
                    //error handling
                } else {
                    throw new Error("no access token in url");
                }
                //error handling with error handling state
            } catch (error) {
                console.error("auth error:", error);
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