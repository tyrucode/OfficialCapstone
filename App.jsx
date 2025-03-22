import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
// pages
import Home from "./src/pages/Home"
import GamePage from "./src/pages/GamePage"
import SpotifyCallback from "./src/pages/SpotifyCallback"
// layouts
import RootLayout from "./src/layouts/RootLayout"
// context
import { UserProvider } from "./context/UserContext";

// routes for all pages
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="game" element={<GamePage />} />
      <Route path="callback" element={<SpotifyCallback />} />
      <Route path="signin" element={<SpotifyCallback />} />
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