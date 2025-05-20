import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router';
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
            // if tokens missing/expired do this and remove them from the page
            localStorage.removeItem('spotify_access_token');
            localStorage.removeItem('spotify_token_expiration');
            // Redirect to home page if not authenticated
            navigate('/');
        }
        //navigate to avoid react warnings
    }, [navigate]);

    return (
        <div>
            {/* if theyre authenticated show the playlist if not show loading (then they will be redirected above) */}
            {isAuthenticated ? (
                <>
                    <h2>To start, choose a playlist!</h2>
                    <PlaylistGrid />
                </>
            ) : (
                <h2>Loading...</h2>
            )}
        </div>
    );
}

export default Game