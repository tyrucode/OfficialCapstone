import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

function PlaylistGrid() {
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const token = localStorage.getItem('spotify_access_token');
                if (!token) {
                    throw new Error('no access token was found');
                }
                const userResponse = await fetch('https://api.spotify.com/v1/me/playlists?limit=30', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                //ui error handling
                if (!userResponse.ok) {
                    throw new Error(`Failed to fetch user playlists: ${userResponse.status}`);
                }
                const userData = await userResponse.json();
                setUserPlaylists(userData.items);
            } catch (e) {
                console.error('error fetching playlists:', e);
                setError(e.message);
            } finally {
                //turn off loading text
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, []);

    const selectPlaylist = (playlistId, playlistName, playlistImage) => {
        //little error handling
        console.log(`selected playlist - ${playlistName} (${playlistId})`);
        //go to corresponding gametime page and send the Id, Name, and Image to that page
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
                    // mapping playlists out
                    userPlaylists.map(playlist => (
                        <div
                            //playlist info
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
                                    <img
                                        src={playlist.images[0].url}
                                        alt={playlist.name}
                                        className="playlist-image"
                                    />
                                ) : (
                                    //if playlist picture doesnt load or just doesnt exist somehow do this
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