import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
// pages
import Home from "./src/pages/Home"
import PlaylistDisplay from "./src/pages/PlaylistDisplay"
import SpotifyCallback from "./src/pages/SpotifyCallback"
import NotFound from "./src/pages/NotFound"
import GameTimePage from "./src/pages/GameTimePage"
// layouts
import RootLayout from "./src/layouts/RootLayout"
// context
import { UserProvider } from "./src/context/UserContext";

// routes for all pages
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="game" element={<PlaylistDisplay />} />
      <Route path="callback" element={<SpotifyCallback />} />
      <Route path="gametime" element={<GameTimePage />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  )
}

export default App