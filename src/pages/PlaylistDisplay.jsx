import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlaylistGrid from "../components/PlaylistGrid"

function Game() {
    //logic to see if a user is logged in
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // check if the user has a valid login token
        const token = localStorage.getItem('spotify_access_token');
        const expirationTime = localStorage.getItem('spotify_token_expiration');
        const currentTime = new Date().getTime();

        if (token && expirationTime && currentTime < expirationTime) {
            setIsAuthenticated(true);
        } else {
            // if tokens missing/expired do this
            localStorage.removeItem('spotify_access_token');
            localStorage.removeItem('spotify_token_expiration');
            // Redirect to home page if not authenticated
            navigate('/');
        }
    }, [navigate]);

    return (
        <div>
            {isAuthenticated ? (
                <>
                    <h2>To start, choose a playlist!</h2>
                    {/* most likely will be a component kinda thing */}
                    {/* Playlist selection and game content will go here */}
                    <PlaylistGrid />
                </>
            ) : (
                <h2>Loading...</h2>
            )}
        </div>
    );
}

export default Game