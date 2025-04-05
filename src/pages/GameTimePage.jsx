import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'

function GameTimePage() {
    //location to get the data from the playlist that was selected
    const location = useLocation();
    const navigate = useNavigate();
    // destructuring
    const { playlistId, playlistName, playlistImage } = location.state || {};

    //checking if data for playlist was passed if not go back
    useEffect(() => {
        if (!playlistId) {
            navigate('/game')
        }
    })
    //loading screen if needed
    if (!playlistId) {
        return <div>Loading...</div>;
    }

    return (
        <div className="game-time-container">
            <img src={playlistImage} />
        </div >
    );
}

export default GameTimePage