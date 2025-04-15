import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Leaderboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();

    // Get playlist data from state or params
    const { playlistId, playlistName } = location.state || {};

    const [scores, setScores] = useState([]);
    const [userScores, setUserScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('global'); // 'global' or 'personal'

    useEffect(() => {
        const fetchScores = async () => {
            setLoading(true);
            setError(null);

            try {
                // Construct the query parameters
                const queryParams = new URLSearchParams();
                if (playlistId) {
                    queryParams.append('playlistId', playlistId);
                }
                queryParams.append('limit', 20);

                // Fetch global scores
                const globalResponse = await fetch(`/api/getScores?${queryParams.toString()}`);

                if (!globalResponse.ok) {
                    throw new Error(`Failed to fetch global scores: ${globalResponse.statusText}`);
                }

                const globalData = await globalResponse.json();
                setScores(globalData.highScores || []);

                // Fetch user's personal scores if logged in
                if (user) {
                    queryParams.append('userId', user.id);
                    queryParams.append('type', 'personal');

                    const userResponse = await fetch(`/api/getScores?${queryParams.toString()}`);

                    if (!userResponse.ok) {
                        throw new Error(`Failed to fetch user scores: ${userResponse.statusText}`);
                    }

                    const userData = await userResponse.json();
                    setUserScores(userData.highScores || []);
                }

            } catch (err) {
                console.error('Error fetching leaderboard data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchScores();
    }, [playlistId, user]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const goBack = () => {
        navigate('/game');
    };

    const playThisPlaylist = () => {
        if (playlistId && playlistName) {
            navigate('/game-time', {
                state: {
                    playlistId,
                    playlistName
                }
            });
        }
    };

    if (loading) {
        return <div className="loading-container">Loading leaderboard...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error loading leaderboard: {error}</p>
                <button onClick={goBack}>Go Back</button>
            </div>
        );
    }

    const activeScores = activeTab === 'global' ? scores : userScores;

    return (
        <div className="leaderboard-container">
            <h2>{playlistName ? `Leaderboard: ${playlistName}` : 'Global Leaderboard'}</h2>

            <div className="leaderboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'global' ? 'active' : ''}`}
                    onClick={() => setActiveTab('global')}
                >
                    Global Top Scores
                </button>
                <button
                    className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('personal')}
                    disabled={!user}
                >
                    Your Scores
                </button>
            </div>

            {activeScores.length > 0 ? (
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Score</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeScores.map((score, index) => (
                            <tr key={score._id} className={user && score.userId === user.id ? 'highlight-row' : ''}>
                                <td>{index + 1}</td>
                                <td className="player-cell">
                                    {score.profilePicture && (
                                        <img
                                            src={score.profilePicture}
                                            alt={score.username}
                                            className="player-avatar"
                                        />
                                    )}
                                    <span>{score.username}</span>
                                </td>
                                <td>{score.score}</td>
                                <td>{formatDate(score.timestamp)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="no-scores">
                    {activeTab === 'global'
                        ? "No scores recorded yet. Be the first to play!"
                        : "You haven't recorded any scores yet."}
                </div>
            )}

            <div className="leaderboard-actions">
                {playlistId && (
                    <button onClick={playThisPlaylist} className="play-btn">
                        Play This Playlist
                    </button>
                )}
                <button onClick={goBack} className="back-btn">
                    Go Back
                </button>
            </div>
        </div>
    );
}

export default Leaderboard;