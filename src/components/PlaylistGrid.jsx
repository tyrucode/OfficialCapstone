import { useState, useEffect } from 'react';

function PlaylistGrid() {
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const token = localStorage.getItem('spotify_access_token');
                if (!token) {
                    throw new Error('no access token was found');
                }
                const userResponse = await fetch('https://api.spotify.com/v1/me/playlists?limit=10', {
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

    const selectPlaylist = (playlistId, playlistName) => {
        console.log(`selected playlist - ${playlistName} (${playlistId})`);
        // Add functionality to start the game with the selected playlist
        // You might want to redirect to a new page or change the game state
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
                            onClick={() => selectPlaylist(playlist.id, playlist.name)}
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
                    <p className="no-playlists">No personal playlists found</p>
                }
            </div>
            {/* spotifys own variety, same thing as uptop except displaying different playlist */}
            {/* realizing now wouldve been better to use a prop but at the time this seemed easier, and i think its fine
            as long as I dont plan on adding more genres / sections. maybe in future ill change it.  */}
            <h3>Popular Spotify Playlists</h3>
            <div className="playlist-grid">
                {spotifyPlaylists.length > 0 ? (
                    spotifyPlaylists.map(playlist => (
                        <div
                            key={playlist.id}
                            className="playlist-card"
                            onClick={() => handlePlaylistSelect(playlist.id, playlist.name)}
                        >
                            <div className="playlist-image-container">
                                {playlist.images && playlist.images.length > 0 ? (
                                    <img
                                        src={playlist.images[0].url}
                                        alt={playlist.name}
                                        className="playlist-image"
                                    />
                                ) : (
                                    <div className="playlist-image-placeholder">
                                        <span>No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="playlist-info">
                                <h4>{playlist.name}</h4>
                                <p>{playlist.tracks ? `${playlist.tracks.total} tracks` : ''}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-playlists">Couldnt load Spotify Playlists</p>
                )}
            </div>
        </div>
    );
    //couldve made this a prop so it was more reuseable but at this point I already made it so I guess theres no point now
    //unless i plan on adding more features and genres/playlists but im not sure its needed 
}

export default PlaylistGrid;