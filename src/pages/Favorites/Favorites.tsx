import React, { useContext, useState } from 'react'
import './style.css'
import SongListItem from '../../components/SongListItem/SongListItem';
import { QueueSongsContext } from '../../contexts/QueueSongsContext';
import FavoritesContext from '../../contexts/FavoritesContext';
import Buttons from '../../components/Buttons/Buttons';
import { Song } from '../../data';
import { Link } from 'react-router-dom';

const Favorites: React.FC = () => {
  const {favorites,favoritesDispatch} = useContext(FavoritesContext)

  const {dispatch} = useContext(QueueSongsContext)
  const setQueueSongs = () => {
    dispatch({type: 'SET_QUEUE', payload: favorites, index: 0})
  }
  const clearFavorites = () => {
    favoritesDispatch({type: 'CLEAR_FAVORITES', payload: []})
  }

  // mulit select
  const [selected, setSelected] = useState<Array<string>>([])
  const addToSelected = (Group: string) => {
    setSelected([...selected, Group])
  }
  const removeFromSelected = (Group: string) => {
    setSelected(selected.filter(item => item!== Group))
  }
  const clearSelected = () => {
    setSelected([])
  }
  // helper function to get selected songs
  const getSelectedSongs: () => Array<Song> = () => {
    const selectedSongs: Array<Song> = selected.flatMap(songId => {
      return favorites.filter(item => item.id === songId)
    })
    return selectedSongs
  }

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Favorites</h1>
        </div>
        <div className="nav-right">
          {
            selected.length > 0 &&
            <Buttons selectedSongs={getSelectedSongs()}
            clearSelected={clearSelected}/>
          }
          {
            selected.length > 0 ||
            <>
              <button onClick={clearFavorites}>Clear Favorites</button>
              <button>Add Files</button>
            </>
          }
        </div>
      </nav>
      {
        favorites.length > 0 ?
        <div className="songs view">
          {
            favorites.map((song, index) => (
              <SongListItem
              key={index} song={song}
              addToSelected={addToSelected}
              selected={selected}
              removeFromSelected={removeFromSelected}
              setQueueSongs={setQueueSongs}
              index={index}/>
            ))
          }
        </div>:
        <div className="empty-window view">
          <div className="cell">
            <h1>No songs to favorites</h1>
            <Link to={'/songs'}>
              <button>Add +</button>
            </Link>
          </div>
        </div>
      }
    </>
  )
}

export default Favorites
