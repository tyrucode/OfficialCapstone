import NewHeader from '../components/NewHeader';
import NewFooter from '../components/NewFooter';
import { Outlet } from 'react-router';

function RootLayout() {
    return (
        <div className="rootLayout">
            <NewHeader />
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