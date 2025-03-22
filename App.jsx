// react router imports
import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from "react-router"
//pages
import Home from "./src/pages/Home"
import GamePage from "./src/pages/GamePage"
//layouts
import RootLayout from "./src/layouts/RootLayout"
//loader functions

//routes for all pages
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="game" element={<GamePage />} />
    </Route>
  )
)
//actual app
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
