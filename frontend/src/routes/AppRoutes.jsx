import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Channel from '../pages/Channel'
import Friends from '../pages/Friends'
import Home from '../pages/Home'
import Profile from '../pages/Profile'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profilo" element={<Profile />} />
          <Route path="/amici" element={<Friends />} />
          <Route path="/canale" element={<Channel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
