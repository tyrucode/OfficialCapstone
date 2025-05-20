import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';

// Import your layouts
import RootLayout from './layouts/RootLayout';

// Import your pages
import Home from './pages/Home';
import PlaylistDisplay from './pages/PlaylistDisplay';
import GameTimePage from './pages/GameTimePage';
import SpotifyCallback from './pages/SpotifyCallback';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';

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