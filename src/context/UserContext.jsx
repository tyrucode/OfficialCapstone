import { createContext, useState, useEffect, useContext } from 'react';
import { getUserProfile } from '../services/spotifyApi';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('spotify_access_token');
            const expiration = localStorage.getItem('spotify_token_expiration');

            if (token && expiration && new Date().getTime() < parseInt(expiration)) {
                // Token is valid, fetch user profile
                const userProfile = await getUserProfile();
                if (userProfile) {
                    setUser(userProfile);
                }
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    const logout = () => {
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_token_expiration');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, loading, logout, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);