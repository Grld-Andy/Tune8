import React, { useContext } from 'react'
import { songs } from '../../assets'
import './style.css'
import SongListItem from '../../components/SongListItem/SongListItem';
import { QueueSongsContext } from '../../contexts/QueueSongsContext';

const Favorites: React.FC = () => {
  const {dispatch} = useContext(QueueSongsContext)
  const setQueueSongs = () => {
    dispatch({type: 'SET_QUEUE', payload: songs})
  }
  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Favorites</h1>
        </div>
        <div className="nav-right">
          <button>Add Files</button>
        </div>
      </nav>
        <div className="songs view">
          {
            songs.map(song => (
              <SongListItem key={song.tag.tags.title} song={song}
              setQueueSongs={setQueueSongs}/>
            ))
          }
        </div>
    </>
  )
}

export default Favorites
