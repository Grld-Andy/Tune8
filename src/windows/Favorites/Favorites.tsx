import React, { useContext } from 'react'
import './style.css'
import SongListItem from '../../components/SongListItem/SongListItem';
import { QueueSongsContext } from '../../contexts/QueueSongsContext';
import FavoritesContext from '../../contexts/FavoritesContext';

const Favorites: React.FC = () => {
  const {favorites,favoritesDispatch} = useContext(FavoritesContext)

  const {dispatch} = useContext(QueueSongsContext)
  const setQueueSongs = () => {
    dispatch({type: 'SET_QUEUE', payload: favorites, index: 0})
  }
  const clearFavorites = () => {
    favoritesDispatch({type: 'CLEAR_FAVORITES', payload: []})
  }

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Favorites</h1>
        </div>
        <div className="nav-right">
          <button onClick={clearFavorites}>Clear Favorites</button>
          <button>Add Files</button>
        </div>
      </nav>
        <div className="songs view">
          {
            favorites.map((song, index) => (
              <SongListItem key={index} song={song}
              setQueueSongs={setQueueSongs} index={index}/>
            ))
          }
        </div>
    </>
  )
}

export default Favorites
