import { NavLink, Outlet } from "react-router-dom"
import HomeIcon from '@mui/icons-material/Home';
import LockSharpIcon from '@mui/icons-material/LockSharp';
import PersonIcon from '@mui/icons-material/Person';
import { redirectToSpotifyLogin } from "../services/spotifyAuth";
import { useUser } from "../context/UserContext";
import { useState } from "react";

function RootLayout() {
    const { user, logout } = useUser();
    const [showDropdown, setShowDropdown] = useState(false);
    //spotify login button
    const handleSpotifyLogin = (e) => {
        e.preventDefault();
        redirectToSpotifyLogin();
    }
    //login/logout dropdown state
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }
    //logout state
    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        setShowDropdown(false);
    }

    return (
        <div className="rootLayout">
            <header>
                <nav>
                    <h1>Guessify!</h1>
                    <NavLink to='/'>Home<HomeIcon /></NavLink>
                    <NavLink to='game'>Play</NavLink>
                    <NavLink to='leaderboard'>Leaderboard</NavLink>
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
            <footer>
                <p>Note: This app <strong>isnt</strong> an official Spotify App. Contact me for any questions. Links: <a href="https://github.com/tyrucode">Github</a> <a href="https://www.linkedin.com/in/tyler-ruiz-84a287305/">Linkedin</a></p>
            </footer>
        </div >
    )
}

export default RootLayout