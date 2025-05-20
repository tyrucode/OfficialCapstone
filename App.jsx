import { Route, Routes } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
// pages
import Home from "./src/pages/Home"
import PlaylistDisplay from "./src/pages/PlaylistDisplay"
import SpotifyCallback from "./src/pages/SpotifyCallback"
import NotFound from "./src/pages/NotFound"
import GameTimePage from "./src/pages/GameTimePage"
import Leaderboard from "./src/pages/Leaderboard"
// layouts
import RootLayout from "./src/layouts/RootLayout"
// context
import { UserProvider } from "./src/context/UserContext";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="game" element={<PlaylistDisplay />} />
          <Route path="callback" element={<SpotifyCallback />} />
          <Route path="gametime" element={<GameTimePage />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Analytics />
    </UserProvider>
  )
}

export default App