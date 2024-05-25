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
import Artist from './windows/Artist/Artist'
import ArtistView from './components/DynamicViews/ArtistView'
import AlbumView from './components/DynamicViews/AlbumView'
import Album from './windows/Album/Album'


// Routing
function App() {

  return (
    <Routes>
      <Route path='/' element={<WindowLayout/>}>
        <Route index element={<Home/>}></Route>
        <Route path='songs' element={<Songs/>}></Route>
        <Route path='albums' element={<Albums/>}></Route>
        <Route path='albumView' element={<AlbumView/>}>
          <Route path=':album' element={<Album/>}></Route>
        </Route>
        <Route path='artists' element={<Artists/>}></Route>
        <Route path='artistView' element={<ArtistView/>}>
          <Route path=':artist' element={<Artist/>}></Route>
        </Route>
        <Route path='queue' element={<Queue/>}></Route>
        <Route path='favorites' element={<Favorites/>}></Route>
        <Route path='playlists' element={<Playlists/>}></Route>
        <Route path='settings' element={<Settings/>}></Route>
      </Route>
    </Routes>
  )
}

export default App
