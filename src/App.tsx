import './App.css'
import WindowLayout from './components/WindowLayout/WindowLayout'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home/Home'
import Songs from './pages/Songs/Songs'
import Albums from './pages/Albums/Albums'
import Artists from './pages/Artists/Artists'
import Queue from './pages/Queue/Queue'
import Playlists from './pages/Playlists/Playlists'
import Favorites from './pages/Favorites/Favorites'
import Settings from './pages/Settings/Settings'
import Artist from './pages/Artist/Artist'
import ArtistView from './components/DynamicViews/ArtistView'
import AlbumView from './components/DynamicViews/AlbumView'
import Album from './pages/Album/Album'
import PlaylistView from './components/DynamicViews/PlaylistView'
import Playlist from './pages/Playlist/Playlist'
import SearchResults from './pages/SearchResults/SearchResults'


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
        <Route path='playlistView' element={<PlaylistView/>}>
          <Route path=':playlist' element={<Playlist/>}></Route>
        </Route>
        <Route path='settings' element={<Settings/>}></Route>
        <Route path='search/:query' element={<SearchResults/>}></Route>
      </Route>
    </Routes>
  )
}

export default App
