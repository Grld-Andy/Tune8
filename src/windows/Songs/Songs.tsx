import React, { useContext } from 'react'
import { songs } from '../../assets'
import './style.css'
import SongListItem from '../../components/SongListItem/SongListItem';
import { QueueSongsContext } from '../../contexts/QueueSongsContext';
import { CurrentSongContext } from '../../contexts/CurrentSongContext';

const Songs: React.FC = () => {
  const {dispatch} = useContext(QueueSongsContext)
  const {currentSongDispatch} = useContext(CurrentSongContext)
  const setQueueSongs: () => void = () => {
    dispatch({type: 'SET_QUEUE', payload: songs})
  }
  const playAllSongs: () => void = () => {
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: songs[0]})
    setQueueSongs()
  }

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Songs</h1>
        </div>
        <div className="nav-right">
          <button onClick={playAllSongs}>Play All</button>
          <button>Shuffle and Play</button>
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

export default Songs
