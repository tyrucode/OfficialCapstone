import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTopHighScores, getUserHighScores } from '../services/highscoreApi';
import { useUser } from '../context/UserContext';

function Leaderboard() {
    const [topScores, setTopScores] = useState([]);
    const [userScores, setUserScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('all'); // 'all' or 'my'
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        // If a specific playlist was selected
        if (location.state?.playlistId) {
            setSelectedPlaylist({
                id: location.state.playlistId,
                name: location.state.playlistName
            });
        }

        const fetchLeaderboardData = async () => {
            try {
                setLoading(true);
                const playlistId = location.state?.playlistId;

                // Fetch top scores
                const scores = await getTopHighScores(20, playlistId);
                setTopScores(scores);

                // Fetch user's scores if logged in
                if (user) {
                    const myScores = await getUserHighScores();
                    setUserScores(myScores);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching leaderboard data:', err);
                setError('Failed to load leaderboard data. Please try again later.');
                setLoading(false);
            }
        };

        fetchLeaderboardData();
    }, [location.state, user]);

    const handlePlaylistClear = () => {
        // setSelectedPlaylist(null);
        navigate('/leaderboard', { replace: true });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        // Format to EST timezone
        const options = {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        return date.toLocaleString('en-US', options) + ' EST';
    };

    if (loading) {
        return <div className="loading-container">Loading leaderboard...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    const scoresToDisplay = selectedTab === 'all' ? topScores : userScores;

    return (
        <div className="leaderboard-container">
            <h2>Leaderboard {selectedPlaylist && `- ${selectedPlaylist.name}`}</h2>

            {selectedPlaylist && (
                <button onClick={handlePlaylistClear} className="clear-playlist-btn">
                    Show All Playlists
                </button>
            )}

            <div className="leaderboard-tabs">
                <button
                    className={`tab-btn ${selectedTab === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('all')}
                >
                    All Players
                </button>
                {user && (
                    <button
                        className={`tab-btn ${selectedTab === 'my' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('my')}
                    >
                        My Scores
                    </button>
                )}
            </div>

            <div className="leaderboard-table-container">
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Score</th>
                            <th>Playlist</th>
                            <th>Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scoresToDisplay.length > 0 ? (
                            scoresToDisplay.map((score, index) => (
                                <tr key={score._id} className={user && score.userId === user.id ? 'current-user-row' : ''}>
                                    <td>{index + 1}</td>
                                    <td className="player-cell">
                                        {score.profilePicture ? (
                                            <img
                                                src={score.profilePicture}
                                                alt={score.username}
                                                className="player-avatar"
                                            />
                                        ) : (
                                            <div className="player-avatar-placeholder"></div>
                                        )}
                                        <span>{score.username}</span>
                                    </td>
                                    <td className="score-cell">{score.score}</td>
                                    <td>{score.playlistName}</td>
                                    <td>{formatDate(score.timestamp)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-scores">
                                    {selectedTab === 'all' ? 'No scores available yet.' : 'You haven\'t played any games yet.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="leaderboard-footer">
                <button onClick={() => navigate('/game')} className="play-btn">
                    Play a Game
                </button>
            </div>
        </div>
    );
}

export default Leaderboard;