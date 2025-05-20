import { createContext, useState, useEffect, useContext } from 'react';
import { getUserProfile } from '../services/spotifyApi';

const UserContext = createContext(null); //context for the users data

export const UserProvider = ({ children }) => {
    //state for user logging
    const [user, setUser] = useState(null); // users profile data
    const [loading, setLoading] = useState(true); // controls loading

    useEffect(() => {
        const checkAuth = async () => {
            //get token
            const token = localStorage.getItem('spotify_access_token');
            const expiration = localStorage.getItem('spotify_token_expiration');
            //check if it is a real token
            if (token && expiration && new Date().getTime() < parseInt(expiration)) {
                // if the token is valid get the profile and set it to there profile
                const userProfile = await getUserProfile();
                if (userProfile) {
                    setUser(userProfile);
                }
            }
            //loading is now finished
            setLoading(false);
        };

        checkAuth();
    }, []);
    //remove data when user is logged out
    const logout = () => {
        // clear all spotify items from localStorage
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_token_expiration');
        localStorage.removeItem('spotify_auth_state');
        setUser(null); //clear state
        window.location.href = "https://accounts.spotify.com/logout"; //take user to the spotify logout page then back to home page
    };
    //provide the context of whether user is logged in or not to the child components
    return (
        <UserContext.Provider value={{ user, loading, logout, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

//custom hook for user context
export const useUser = () => useContext(UserContext);