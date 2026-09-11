import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from '../layouts/Layout'
import CreatePost from '../pages/CreatePost'
import Friends from '../pages/Friends'
import Home from '../pages/Home'
import Notifications from '../pages/Notifications'
import Profile from '../pages/Profile'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/crea" element={<CreatePost />} />
          <Route path="/profilo" element={<Profile />} />
          <Route path="/amici" element={<Friends />} />
          <Route path="/notifiche" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
