// src/pages/Leaderboard.jsx
import { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/scoreApi';

function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                setLoading(true);
                const data = await getLeaderboard(10); // Get top 10 scores
                setLeaderboardData(data);
            } catch (err) {
                console.error("Failed to fetch leaderboard:", err);
                setError("Failed to load leaderboard data. Please try again later.");
            } finally {
                setLoading(false);
            }
        }

        fetchLeaderboard();
    }, []);

    if (loading) return <div className="loading-container">Loading leaderboard...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="leaderboard-container">
            <h1>Top Players</h1>

            {leaderboardData.length === 0 ? (
                <p className="no-scores">No scores recorded yet. Be the first to play!</p>
            ) : (
                <div className="leaderboard">
                    <div className="leaderboard-header">
                        <div className="rank">#</div>
                        <div className="player">Player</div>
                        <div className="score">Score</div>
                    </div>

                    {leaderboardData.map((user, index) => (
                        <div key={user.spotifyId} className="leaderboard-row">
                            <div className="rank">{index + 1}</div>
                            <div className="player">
                                {user.profileImage && (
                                    <img
                                        src={user.profileImage}
                                        alt={user.displayName}
                                        className="player-image"
                                    />
                                )}
                                <span>{user.displayName}</span>
                            </div>
                            <div className="score">{user.highScore}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Leaderboard;