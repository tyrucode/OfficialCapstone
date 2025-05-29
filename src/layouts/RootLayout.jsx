//mui icons
import HomeIcon from '@mui/icons-material/Home';
import LockSharpIcon from '@mui/icons-material/LockSharp';
import PersonIcon from '@mui/icons-material/Person';
//imports
import { NavLink, Outlet } from "react-router-dom"
import { redirectToSpotifyLogin } from "../services/spotifyAuth";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import NewFooter from '../components/NewFooter';

function RootLayout() {
    const { user, logout } = useUser(); //get user data from the context
    const [showDropdown, setShowDropdown] = useState(false); //dropdown state
    //spotify login button
    const handleSpotifyLogin = (e) => {
        e.preventDefault();
        redirectToSpotifyLogin(); //go to spotify for auth
    }
    //login/logout dropdown state
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    //logout state
    const handleLogout = (e) => {
        e.preventDefault();
        //close dropdown then logout
        setShowDropdown(false);
        //logging out using context function.
        logout();
    }

    return (
        <div className="rootLayout">
            <header>
                <nav>
                    <h1>Guessify!</h1>
                    <NavLink to='/'>Home<HomeIcon /></NavLink>
                    <NavLink to='game'>Play</NavLink>
                    <NavLink to='leaderboard'>Leaderboard</NavLink>
                    {/* basically showingn sign in if the user is signed in but if theyre not signed in then dont. */}
                    {!user ? (
                        <a href="#" onClick={handleSpotifyLogin}>Sign In!<LockSharpIcon /></a>
                    ) : (
                        <div style={{ position: 'relative' }}>
                            <div
                                onClick={toggleDropdown}
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {user.images && user.images.length > 0 ? (
                                    <img
                                        src={user.images[0].url}
                                        alt={user.display_name}
                                        style={{
                                            width: '45px',
                                            height: '45px',
                                            borderRadius: '50%',
                                            border: '2px solid #1db954'
                                        }}
                                    />
                                ) : (
                                    <PersonIcon style={{ color: '#1db954' }} />
                                )}
                                <span>{user.display_name}</span>
                            </div>

                            {showDropdown && (
                                <div style={{
                                    position: 'absolute',
                                    right: '0',
                                    top: '40px',
                                    borderRadius: '4px',
                                    padding: '8px',
                                    zIndex: 100,
                                }}>
                                    <a
                                        href="#"
                                        onClick={handleLogout}
                                        style={{
                                            display: 'block',
                                            padding: '8px 16px',
                                            textDecoration: 'none',
                                            color: 'white'
                                        }}
                                    >
                                        Sign Out
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </nav>
            </header>
            <main>
                <h2>The Spotify Guessing Game</h2>
                <h3>Inspired by Wordle</h3>
                <Outlet />
            </main>
            <NewFooter />
        </div >
    )
}

export default RootLayout