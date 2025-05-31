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

            <header class="bg-transparent">
                <nav class="flex gap-4 justify-end max-w-screen-xl mx-auto items-center px-4 py-2">
                    <h1 class=" hover:scale-105 transition-all duration-200 ease-in-out transform mr-auto text-[175%] mb-0 border-b-[3px] border-[#1db954] shadow-[10px_10px_5px_rgba(0,0,0,0.75)]">
                        Guessify!
                    </h1>
                    <a
                        href="#"
                        class="text-white no-underline px-2 py-1 rounded-[25%] border-2 border-[#1db954] text-[175%] shadow-[10px_10px_5px_rgba(0,0,0,0.75)] hover:text-[#1db954] hover:scale-105 transition-all duration-200 ease-in-out transform"
                    ><NavLink to='/'>Home<HomeIcon /></NavLink></a>
                    <a
                        href="#"
                        class="text-white no-underline px-2 py-1 rounded-[25%] border-2 border-[#1db954] text-[175%] shadow-[10px_10px_5px_rgba(0,0,0,0.75)] hover:text-[#1db954] hover:scale-105 transition-all duration-200 ease-in-out transform"
                    ><NavLink to='game'>Play</NavLink></a>
                    <a
                        href="#"
                        class="text-white no-underline px-2 py-1 rounded-[25%] border-2 border-[#1db954] text-[175%] shadow-[10px_10px_5px_rgba(0,0,0,0.75)] hover:text-[#1db954] hover:scale-105 transition-all duration-200 ease-in-out transform"
                    ><NavLink to='leaderboard'>Leaderboard</NavLink></a>
                    {!user ? (
                        <a href="#" class="text-white no-underline px-2 py-1 rounded-[25%] border-2 border-[#1db954] text-[175%] shadow-[10px_10px_5px_rgba(0,0,0,0.75)] hover:text-[#1db954] hover:scale-105 transition-all duration-200 ease-in-out transform" onClick={handleSpotifyLogin}>Sign In!<LockSharpIcon /></a>
                    ) : (
                        <div style={{ position: 'relative' }} class='hover:scale-105  transition-all duration-200 ease-in-out transform'>
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
                                            width: '55px',
                                            height: '55px',
                                            borderRadius: '50%',
                                            border: '2px solid #1db954'
                                        }}

                                    />
                                ) : (
                                    <PersonIcon style={{ color: '#1db954' }} />
                                )}
                                <span class='text-[115%]'>{user.display_name}</span>
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
                                    <a class=" no-underline px-2 py-1 rounded-[25%] border-2 border-red text-[110%] shadow-[10px_10px_5px_rgba(0,0,0,0.75)] hover:text-[#1db954] hover:scale-105 transition-all duration-200 ease-in-out transform"
                                        href="#"
                                        onClick={handleLogout}
                                    >
                                        Sign Out
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </nav>
            </header>

        </>
    )
}

export default NewHeader