import { createContext, useState, useEffect, useContext } from 'react';
import { getUserProfile } from '../services/spotifyApi';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    //state for user logging
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_token_expiration');
        setUser(null);
    };
    //context
    return (
        <UserContext.Provider value={{ user, loading, logout, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);