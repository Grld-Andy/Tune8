import './App.css'
import WindowLayout from './components/WindowLayout/WindowLayout'
import {Routes, Route} from 'react-router-dom'
import Home from './windows/Home/Home'
import Songs from './windows/Songs/Songs'
import Albums from './windows/Albums/Albums'
import Artists from './windows/Artists/Artists'
import Queue from './windows/Queue/Queue'
import Playlists from './windows/Playlists/Playlists'
import Favorites from './windows/Favorites/Favorites'
import Settings from './windows/Settings/Settings'


// Routing
function App() {

  return (
    <Routes>
      <Route path='/' element={<WindowLayout/>}>
        <Route index element={<Home/>}></Route>
        <Route path='songs' element={<Songs/>}></Route>
        <Route path='albums' element={<Albums/>}></Route>
        <Route path='artists' element={<Artists/>}></Route>
        <Route path='queue' element={<Queue/>}></Route>
        <Route path='favorites' element={<Favorites/>}></Route>
        <Route path='playlists' element={<Playlists/>}></Route>
        <Route path='settings' element={<Settings/>}></Route>
      </Route>
    </Routes>
  )
}

export default App
