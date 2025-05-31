//mui icons
import HomeIcon from '@mui/icons-material/Home';
import LockSharpIcon from '@mui/icons-material/LockSharp';
import PersonIcon from '@mui/icons-material/Person';
//imports
import { NavLink } from "react-router-dom"
import { redirectToSpotifyLogin } from "../services/spotifyAuth";
import { useUser } from "../context/UserContext";
import { useState } from "react";

function NewHeader() {
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
        <>

            <header className="bg-transparent">
                <nav className="navbar max-w-screen-xl mx-auto px-4 py-2">

                    <div className="navbar-center lg:navbar-start">
                        <h1 className="hover:scale-105 transition-all duration-200 ease-in-out transform text-[175%] border-b-[3px] border-[#1db954] shadow-[10px_10px_5px_rgba(0,0,0,0.75)] mr-4">
                            Guessify!
                        </h1>
                    </div>
                    <div className="navbar-start lg:hidden justify-end">
                        <div className="dropdown">
                            <label tabIndex={0} className="btn btn-ghost p-0 m-0">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-[#1db954]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </label>
                            <ul
                                tabIndex={0}
                                className="left-1/2 -translate-x-1/2 menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-[10px_10px_5px_rgba(0,0,0,0.75)] bg-zinc-800 rounded-box w-30"
                            >
                                <li>
                                    <NavLink to="/" className="hover:text-[#1db954]">Home</NavLink>
                                </li>
                                <li>
                                    <NavLink to="game" className="hover:text-[#1db954]">Play</NavLink>
                                </li>
                                <li>
                                    <NavLink to="leaderboard" className="hover:text-[#1db954]">Leaderboard</NavLink>
                                </li>
                                {!user ? (
                                    <li>
                                        <a onClick={handleSpotifyLogin} className="hover:text-[#1db954]">Sign In!</a>
                                    </li>
                                ) : (
                                    <li>
                                        <a onClick={handleLogout} className="hover:text-[#1db954]">Sign Out</a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    {/* Desktop Menu - Hidden on small screens */}
                    <div className="navbar-end hidden lg:flex gap-4 items-center">
                        <NavLink
                            to="/"
                            className="text-white no-underline px-2 py-1 rounded-[25%] border-2 border-[#1db954] text-[175%] shadow-[10px_10px_5px_rgba(0,0,0,0.75)] hover:text-[#1db954] hover:scale-105 transition-all duration-200 ease-in-out transform"
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="game"
                            className="text-white no-underline px-2 py-1 rounded-[25%] border-2 border-[#1db954] text-[175%] shadow-[10px_10px_5px_rgba(0,0,0,0.75)] hover:text-[#1db954] hover:scale-105 transition-all duration-200 ease-in-out transform"
                        >
                            Play
                        </NavLink>
                        <NavLink
                            to="leaderboard"
                            className="text-white no-underline px-2 py-1 rounded-[25%] border-2 border-[#1db954] text-[175%] shadow-[10px_10px_5px_rgba(0,0,0,0.75)] hover:text-[#1db954] hover:scale-105 transition-all duration-200 ease-in-out transform"
                        >
                            Leaderboard
                        </NavLink>

                        {!user ? (
                            <a
                                onClick={handleSpotifyLogin}
                                className="text-white no-underline px-2 py-1 rounded-[25%] border-2 border-[#1db954] text-[175%] shadow-[10px_10px_5px_rgba(0,0,0,0.75)] hover:text-[#1db954] hover:scale-105 transition-all duration-200 ease-in-out transform"
                            >
                                Sign In!
                            </a>
                        ) : (
                            <div className="relative hover:scale-105 transition-all duration-200 ease-in-out transform">
                                <div
                                    onClick={toggleDropdown}
                                    className="cursor-pointer flex items-center gap-2"
                                >
                                    {user.images && user.images.length > 0 ? (
                                        <img
                                            src={user.images[0].url}
                                            alt={user.display_name}
                                            className="w-[55px] h-[55px] rounded-full border-2 border-[#1db954]"
                                        />
                                    ) : (
                                        <PersonIcon style={{ color: '#1db954' }} />
                                    )}
                                    <span className="text-[115%] text-white">{user.display_name}</span>
                                </div>
                                {showDropdown && (
                                    <div className="absolute right-0 top-[60px] rounded px-2 py-1 shadow-[10px_10px_5px_rgba(0,0,0,0.75)] bg-base-100 z-10">
                                        <a
                                            onClick={handleLogout}
                                            className="no-underline px-2 py-1 text-[110%] hover:text-[#1db954] hover:scale-105 transition-all duration-200 ease-in-out transform block"
                                        >
                                            Sign Out
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </nav>
            </header>


        </>
    )
}

export default NewHeader