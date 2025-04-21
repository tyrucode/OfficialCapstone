import { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/apiService'; //import api service for leaderboard

function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]); //show the leaderboard entries
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        //func to fetch leaderboard data
        const fetchLeaderboard = async () => {
            try {
                //get leaderboard data from api
                const data = await getLeaderboard();
                setLeaderboardData(data); //add that data to the state
                setLoading(false);
            } catch (error) {
                // e handling
                console.error("error fetching leaderboard:", error);
                setError("failed to load leaderboard try again later.");
                setLoading(false);
            }
        };
        //call the function on mount
        fetchLeaderboard();
    }, []);
    //load while fetching
    if (loading) return <div className="loading-container">Loading leaderboard...</div>;
    // error if it doesnt load
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="leaderboard-container">
            <h1>Leaderboard</h1>
            <p>Top Guessify Players</p>
            {/* data will either show or not depending on if it exists */}
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
                    {/* map through players and create the table rows depending on how many there are */}
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