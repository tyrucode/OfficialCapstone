import { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/apiService';

function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await getLeaderboard();
                setLeaderboardData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
                setError("Failed to load leaderboard data. Please try again later.");
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) return <div className="loading-container">Loading leaderboard...</div>;

    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="leaderboard-container">
            <h1>Leaderboard</h1>
            <p>Top Guessify Players</p>

            {leaderboardData.length === 0 ? (
                <p>No scores recorded yet. Be the first to play!</p>
            ) : (
                <div className="leaderboard-table">
                    <div className="leaderboard-header">
                        <div className="rank">Rank</div>
                        <div className="player">Player</div>
                        <div className="score">High Score</div>
                        <div className="last-played">Last Played</div>
                    </div>

                    {leaderboardData.map((player, index) => (
                        <div key={player._id} className="leaderboard-row">
                            <div className="rank">{index + 1}</div>
                            <div className="player">
                                {player.profileImage && (
                                    <img
                                        src={player.profileImage}
                                        alt={player.displayName}
                                        className="player-avatar"
                                    />
                                )}
                                <span>{player.displayName}</span>
                            </div>
                            <div className="score">{player.highScore}</div>
                            <div className="last-played">
                                {new Date(player.lastPlayed).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Leaderboard;