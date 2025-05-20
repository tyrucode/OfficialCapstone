import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './src/context/UserContext';

// Import your layouts
import RootLayout from './src/layouts/RootLayout'

// Import your pages
import Home from './src/pages/Home'
import PlaylistDisplay from './src/pages/PlaylistDisplay';
import GameTimePage from './src/pages/GameTimePage';
import SpotifyCallback from './src/pages/SpotifyCallback';
import Leaderboard from './src/pages/Leaderboard';
import NotFound from './src/pages/NotFound';

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="game" element={<PlaylistDisplay />} />
            <Route path="gametime" element={<GameTimePage />} />
            <Route path="callback" element={<SpotifyCallback />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;