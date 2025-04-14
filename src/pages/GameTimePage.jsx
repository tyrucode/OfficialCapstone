import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { spotifyPlayer } from '../services/spotifyPlayer';
import { useUser } from '../context/UserContext';

function GameTimePage() {
    // location/nav to get playlist that was selected
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();

    // getting playlist name/id/image from location.state
    const { playlistId, playlistName } = location.state || {};

    // all state to load the game itself
    const [loading, setLoading] = useState(true); //loading screen
    const [currentTrack, setCurrentTrack] = useState(null); //current track
    const [tracks, setTracks] = useState([]); //tracks available
    const [guessInput, setGuessInput] = useState(''); //guesses
    const [guessesLeft, setGuessesLeft] = useState(3); //guesses left
    const [gameStatus, setGameStatus] = useState('playing'); // make this win / lost / playing
    const [feedback, setFeedback] = useState(''); //feedback message
    const [playlistImage, setPlaylistImage] = useState(''); //img
    const [isPremium, setIsPremium] = useState(false); //making sure nonpremium users cant play
    const [playerReady, setPlayerReady] = useState(false); //seeing if game is ready
    const [score, setScore] = useState(0); //user score


    // state for the audio player
    const [isPlaying, setIsPlaying] = useState(false);

    // when component mounts get the playlist and initialize the game
    useEffect(() => {
        // if no playlist has been passed go back to game page
        if (!playlistId) {
            navigate('/game');
            return;
        }
        //checking subscription 
        const checkUserSubscription = async () => {
            try {
                const token = localStorage.getItem('spotify_access_token');
                const response = await fetch('https://api.spotify.com/v1/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                // error handling
                if (!response.ok) {
                    throw new Error(`Failed to fetch user data: ${response.status}`);
                }
                //getting users data
                const userData = await response.json();
                // cmaking sure they have premium
                const hasPremium = userData.product === 'premium';
                setIsPremium(hasPremium);
                //if no premium dont allow game access
                if (!hasPremium) {
                    setFeedback("Spotify Premium is required to play this game. Please upgrade your Spotify account.");
                    setLoading(false);
                    return false;
                }

                return true; //true meaning they do have premium
                //error handling
            } catch (error) {
                console.error("Error checking subscription:", error);
                setFeedback(`Error: ${error.message}. Please try again.`);
                setLoading(false);
                return false;
            }
        };
        //starting the game through our initializePlayer function from earlier and setting readiness to true
        const initializePlayer = async () => {
            try {
                await spotifyPlayer.initializePlayer();
                setPlayerReady(true);
                return true;
            } catch (error) {
                console.error("failed to initialize the player:", error);
                setFeedback(`error: ${error.message}. please refresh or try again.`);
                setLoading(false);
                return false;
            }
        };

        //get the playlist details
        const fetchPlaylistDetails = async () => {
            try {
                //get token from local storage
                const token = localStorage.getItem('spotify_access_token');

                //  use that token for the playlist details of whatever one user selects
                const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                //error handling
                if (!playlistResponse.ok) {
                    throw new Error(`failed to get the playlist try again, error: ${playlistResponse.status}`);
                }
                //setting the playlist data as a variable
                const playlistData = await playlistResponse.json();
                // setting the playlist image as the image from api response
                if (playlistData.images && playlistData.images.length > 0) {
                    setPlaylistImage(playlistData.images[0].url);
                }
                // get all the playlists tracks
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

                // We don't need to filter by preview_url anymore since we're using full tracks
                const validTracks = tracksData.items.filter(item =>
                    item.track &&
                    !item.track.is_local // Filter out local tracks
                );

                //error handling for empty tracks
                if (validTracks.length === 0) {
                    setFeedback("No playable tracks in this playlist, please choose another playlist and try again.");
                    setLoading(false);
                    return;
                }

                //set the tracks to the working track
                setTracks(validTracks);

                // take the working tracks and select a random track from that then set the current track to that random one 
                const randomTrack = validTracks[Math.floor(Math.random() * validTracks.length)].track;
                setCurrentTrack(randomTrack);

                setLoading(false);
            } catch (error) {
                console.error("error fetching playlist data:", error);
                setFeedback(`error: ${error.message}. please try again.`);
                setLoading(false);
            }
        };
        //setup function that combines everything above will also checking for premium and making sure user is intialized
        const setup = async () => {
            const hasPremium = await checkUserSubscription();
            if (!hasPremium) return;

            const playerInitialized = await initializePlayer();
            if (!playerInitialized) return;

            await fetchPlaylistDetails();
        };

        //run the setup
        setup();

        // cleanup function
        return () => {
            spotifyPlayer.disconnect();
        };
    }, [playlistId, navigate]);



    // controls for audio
    const togglePlay = async () => {
        if (isPlaying) {
            await spotifyPlayer.pausePlayback();
        } else {
            if (currentTrack) {
                await spotifyPlayer.playTrackSnippet(currentTrack.uri);
            }
        }
        setIsPlaying(!isPlaying);
    };

    // volume changer controls
    const handleVolumeChange = (e) => {
        const volume = e.target.value;
        spotifyPlayer.setVolume(volume);
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
            //update user score
            setScore(score + 100);
            //pause audio
            spotifyPlayer.pausePlayback();
            setIsPlaying(false);
        } else {
            // if they're wrong they lose 1 life
            const newGuessesLeft = guessesLeft - 1;
            setGuessesLeft(newGuessesLeft);
            //logic for a loss
            if (newGuessesLeft === 0) {
                setGameStatus('lost');
                setFeedback(`Game over! The song was "${currentTrack.name}" by ${currentTrack.artists[0].name}. LOSER`);
                spotifyPlayer.pausePlayback();
                setIsPlaying(false);
                setScore(0);
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


        // Pause any current playback
        spotifyPlayer.pausePlayback();

        // selecting a random track again for new game
        if (tracks.length > 0) {
            const randomTrack = tracks[Math.floor(Math.random() * tracks.length)].track;
            setCurrentTrack(randomTrack);
        }
    };

    // to take user back to game page
    const goBack = () => {
        navigate('/game');
    };

    // View leaderboard
    const viewLeaderboard = () => {
        navigate('/leaderboard', {
            state: {
                playlistId,
                playlistName
            }
        });
    };

    // loading screen
    if (loading) {
        return <div className="loading-container">Loading game...</div>;
    }

    // If user doesn't have premium, show message
    if (!isPremium) {
        return (
            <div className="game-time-container">
                <div className="feedback-message">
                    <h3>Spotify Premium Required</h3>
                    <p>This game requires a Spotify Premium subscription to play full track snippets.</p>
                    <div className="game-controls">
                        <button onClick={goBack}>Go Back</button>
                    </div>
                </div>
            </div>
        );
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
                    <div className='titleScore'>
                        <h2>{playlistName}<h2 id='userScore'>{score}</h2></h2>
                    </div>
                    {currentTrack && gameStatus === 'playing' && playerReady && (
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
                                    defaultValue="30"
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
                    <button onClick={viewLeaderboard}>View Leaderboard</button>
                </div>
            )}

            <div className="game-controls">
                <button onClick={goBack}>Choose Another Playlist</button>
            </div>
        </div>
    );
}

export default GameTimePage;