//react router imports
import { NavLink, Outlet } from "react-router"
//other imports
import HomeIcon from '@mui/icons-material/Home';
import LockSharpIcon from '@mui/icons-material/LockSharp';

function RootLayout() {
    return (
        <div className="rootLayout">
            <header>
                <nav>
                    <h1>Guessify!</h1>
                    <NavLink to='/'>Home<HomeIcon /></NavLink>
                    <NavLink>Sign In!<LockSharpIcon /></NavLink>
                    <NavLink to='game'>Play</NavLink>
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