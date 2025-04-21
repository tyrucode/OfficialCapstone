import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

function PlaylistGrid() {
    // hooks
    const [userPlaylists, setUserPlaylists] = useState([]); // store users playlist
    const [loading, setLoading] = useState(true); // controls loading state
    const [error, setError] = useState(null); // stores errors from fetch
    const navigate = useNavigate();

    useEffect(() => {
        // fetches playlist from the api
        const fetchPlaylists = async () => {
            try {
                //get token for api
                const token = localStorage.getItem('spotify_access_token');
                if (!token) {
                    throw new Error('no access token was found');
                }
                //fetch 30 playlist using the token for auth
                const userResponse = await fetch('https://api.spotify.com/v1/me/playlists?limit=30', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                // ui error handling
                if (!userResponse.ok) {
                    throw new Error(`Failed to fetch user playlists: ${userResponse.status}`);
                }
                // make the response json
                const userData = await userResponse.json();
                // add the playlists to the state
                setUserPlaylists(userData.items);
            } catch (e) {
                // e handling
                console.error('error fetching playlists:', e);
                setError(e.message);
            } finally {
                //turn off loading text
                setLoading(false);
            }
        };
        // fetch the function once the component mounts
        fetchPlaylists();
    }, []);
    // function for when the user selects a playlisti
    const selectPlaylist = (playlistId, playlistName, playlistImage) => {
        //log the playlist that is picked
        console.log(`selected playlist - ${playlistName} (${playlistId})`);
        //go to corresponding gametime page and send the Id, Name, and Image info to that page 
        navigate('/gametime', {
            state: {
                playlistId,
                playlistName,
                playlistImage
            }
        });
    };
    //loading ui text
    if (loading) return <div className="loading-container"><p>Loading playlists...</p></div>;

    return (
        <div className="playlist-container">
            <h3>Your Playlists</h3>
            <div className="playlist-grid">
                {userPlaylists.length > 0 ?
                    // map through playlists and make the grid with css
                    userPlaylists.map(playlist => (
                        <div
                            // when the playlist is clicked select it and open the page for it
                            key={playlist.id}
                            className="playlist-card"
                            onClick={() => selectPlaylist(playlist.id,
                                playlist.name,
                                // if playlist image exists there is one then return the image url otherwise return null
                                playlist.images && playlist.images.length > 0 ? playlist.images[0].url : null
                            )}
                        >
                            <div className="playlist-image-container">
                                {playlist.images && playlist.images.length > 0 ? (
                                    // if it has a image display it 
                                    <img
                                        src={playlist.images[0].url}
                                        alt={playlist.name}
                                        className="playlist-image"
                                    />
                                ) : (
                                    //if playlist has no image or doesnt load then placeholder
                                    <div className="playlist-image-placeholder">
                                        <span>No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="playlist-info">
                                <h4>{playlist.name}</h4>
                                <p>{playlist.tracks.total} tracks</p>
                            </div>
                        </div>
                        // if somehow user has no playlist display ui text
                    )) :
                    <p className="no-playlists">No saved/personal playlists have been found, save some to play the game!</p>
                }
            </div>
        </div>
    );
}

export default PlaylistGrid;