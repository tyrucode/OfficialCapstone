import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function GameTimePage() {
    // location/nav to get playlist that was selected
    const location = useLocation();
    const navigate = useNavigate();

    // Destructuring playlist data into location state or the object w info
    const { playlistId, playlistName } = location.state || {};

    // state for the game itself
    const [loading, setLoading] = useState(true);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [guessInput, setGuessInput] = useState('');
    const [guessesLeft, setGuessesLeft] = useState(3);
    const [gameStatus, setGameStatus] = useState('playing'); // make this win / lost / playing
    const [feedback, setFeedback] = useState('');
    const [playlistImage, setPlaylistImage] = useState('');

    // state for the audio player
    const [audio] = useState(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);

    // when component mounts get the playlist
    useEffect(() => {
        // if no playlist data has been passed return to game page
        if (!playlistId) {
            navigate('/game');
            return;
        }
        //fetch playlist details
        const fetchPlaylistDetails = async () => {
            try {
                //fetch playlist data using token
                const token = localStorage.getItem('spotify_access_token');

                // get playlist details
                const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                //error handling
                if (!playlistResponse.ok) {
                    throw new Error(`failed to fetch playlist: ${playlistResponse.status}`);
                }
                //playlist variable
                const playlistData = await playlistResponse.json();
                // setting the playlist image as the image from api response
                if (playlistData.images && playlistData.images.length > 0) {
                    setPlaylistImage(playlistData.images[0].url);
                }

                // after getting image get all tracks from the playlist
                const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                //more error handling
                if (!tracksResponse.ok) {
                    throw new Error(`failed to fetch the tracks: ${tracksResponse.status}`);
                }
                // making response a variable
                const tracksData = await tracksResponse.json();
                //making sure the tracks are valid and work
                const validTracks = tracksData.items.filter(item =>
                    item.track &&
                    item.track.preview_url !== null
                );
                //error handling for empty tracks
                if (validTracks.length === 0) {
                    setFeedback("No playable tracks in this playlist, please choose another playlist and try again.");
                    setLoading(false);
                    return;
                }
                //set the tracks to the working track
                setTracks(validTracks);

                // take the valid tracks and select a random track from that, then set the current track to the random one 
                const randomTrack = validTracks[Math.floor(Math.random() * validTracks.length)].track;
                setCurrentTrack(randomTrack);

                // set up the audio for it
                audio.src = randomTrack.preview_url;
                audio.volume = 0.7;

                setLoading(false);
            } catch (error) {
                console.error("error fetching playlist data:", error);
                setFeedback(`error: ${error.message}. please try again.`);
                setLoading(false);
            }
        };
        //run the above function
        fetchPlaylistDetails();

        //small cleanup function for audio purposes
        return () => {
            audio.pause();
            audio.src = '';
        };
    }, [playlistId, navigate, audio]);

    // play/pause for audio controls
    const togglePlay = () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    // volume changer controls
    const handleVolumeChange = (e) => {
        const volume = e.target.value / 100;
        audio.volume = volume;
    };

    // function for submissions
    const handleGuess = (e) => {
        //dont refresh when pressed
        e.preventDefault();
        //error handling
        if (!guessInput.trim() || gameStatus !== 'playing') return;
        //take the guess, lowercase it, and get rid of extra space
        const normalizedGuess = guessInput.toLowerCase().trim();
        //for guessing purposes we do the same to the track name so its less case sensitive
        const normalizedTrackName = currentTrack?.name.toLowerCase().trim();

        // check to see if guess is correct
        if (normalizedGuess === normalizedTrackName) {
            setGameStatus('won');
            //let user know they won
            setFeedback(`Correct! The song is "${currentTrack.name}" by ${currentTrack.artists[0].name}.`);
            //pause audio
            audio.pause();
            setIsPlaying(false);
        } else {
            // if theyre wrong they lose 1 life
            const newGuessesLeft = guessesLeft - 1;
            setGuessesLeft(newGuessesLeft);
            //logic for a loss
            if (newGuessesLeft === 0) {
                setGameStatus('lost');
                setFeedback(`Game over! The song was "${currentTrack.name}" by ${currentTrack.artists[0].name}. LOSER`);
                audio.pause();
                setIsPlaying(false);
            } else {
                setFeedback(`Wrong guess! You have ${newGuessesLeft} guesses left.`);
            }
        }
        //whenever a guess is made empty the input box
        setGuessInput('');
    };

    // play a new game
    const playNewGame = () => {
        // wiping/reseting the game
        setGuessInput('');
        setGuessesLeft(3);
        setGameStatus('playing');
        setFeedback('');
        setIsPlaying(false);

        // selecting a random track again for new game
        if (tracks.length > 0) {
            const randomTrack = tracks[Math.floor(Math.random() * tracks.length)].track;
            setCurrentTrack(randomTrack);

            // resetting up the audio
            audio.src = randomTrack.preview_url;
            audio.pause();
        }
    };

    // to take user back to game page
    const goBack = () => {
        navigate('/game');
    };

    // loading screen
    if (loading) {
        return <div className="loading-container">Loading game...</div>;
    }

    return (
        <div className="game-time-container">
            <div className="selected-playlist">
                {playlistImage && (
                    <img
                        src={playlistImage}
                        alt={playlistName}
                        className="selected-playlist-image"
                    />
                )}
                <div className="playlist-details">
                    <h3>{playlistName}</h3>
                    {currentTrack && gameStatus === 'playing' && (
                        <div className="audio-controls">
                            <button onClick={togglePlay}>
                                {isPlaying ? 'Pause' : 'Play'} Snippet
                            </button>
                            <div className="volume-control">
                                <label htmlFor="volume">Volume:</label>
                                <input
                                    type="range"
                                    id="volume"
                                    min="0"
                                    max="100"
                                    defaultValue="70"
                                    onChange={handleVolumeChange}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {feedback && <p className="feedback-message">{feedback}</p>}

            {gameStatus === 'playing' ? (
                <form onSubmit={handleGuess} className="guess-form">
                    <div className="guess-input-container">
                        <input
                            type="text"
                            value={guessInput}
                            onChange={(e) => setGuessInput(e.target.value)}
                            placeholder="Enter song name..."
                            disabled={!currentTrack || gameStatus !== 'playing'}
                            className="guess-input"
                        />
                        <button type="submit" disabled={!currentTrack || gameStatus !== 'playing'}>
                            Guess
                        </button>
                    </div>
                    <p>Remaining guesses: {guessesLeft}</p>
                </form>
            ) : (
                <div className="game-over-controls">
                    <button onClick={playNewGame}>Play Again</button>
                </div>
            )}

            <div className="game-controls">
                <button onClick={goBack}>Choose Another Playlist</button>
            </div>
        </div>
    );
}

export default GameTimePage;