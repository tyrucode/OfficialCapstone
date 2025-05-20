import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
// pages
import Home from "./pages/Home"
import PlaylistDisplay from "./pages/PlaylistDisplay"
import SpotifyCallback from "./pages/SpotifyCallback"
import NotFound from "./pages/NotFound"
import GameTimePage from "./pages/GameTimePage"
import Leaderboard from "./pages/Leaderboard"
// layouts
import RootLayout from "./layouts/RootLayout"
// context
import { UserProvider } from "./context/UserContext";

// routes for all pages
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="game" element={<PlaylistDisplay />} />
      <Route path="callback" element={<SpotifyCallback />} />
      <Route path="gametime" element={<GameTimePage />} />
      <Route path="leaderboard" element={<Leaderboard />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
      <Analytics />
    </UserProvider>
  )
}

export default App