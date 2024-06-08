import React, { useContext } from 'react'
import './style.css'
import SongListItem from '../../components/SongListItem/SongListItem';
import { QueueSongsContext } from '../../contexts/QueueSongsContext';
import { CurrentSongContext } from '../../contexts/CurrentSongContext';
import { shuffleArray } from '../../constants';
import { AllSongsContext } from '../../contexts/AllSongsContext';

const Songs: React.FC = () => {
  const {songs} = useContext(AllSongsContext)

  const {dispatch} = useContext(QueueSongsContext)
  const {currentSongDispatch} = useContext(CurrentSongContext)
  const setQueueSongs: () => void = () => {
    dispatch({type: 'SET_QUEUE', payload: songs, index: 0})
  }
  const playAllSongs: () => void = () => {
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: songs[0], index: 0, reset: true, isPlaying: true})
    setQueueSongs()
  }
  const shuffleSongs: () => void = () => {
    const newQueue = shuffleArray(songs)
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: newQueue[0], index: 0, reset: true, isPlaying: true})
    dispatch({type: 'SET_QUEUE', payload: newQueue, index: 0})
  }

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Songs</h1>
        </div>
        <div className="nav-right">
          <button onClick={playAllSongs}>Play All</button>
          <button onClick={shuffleSongs}>Shuffle and Play</button>
          <button>Add Files</button>
        </div>
      </nav>
        <div className="songs view">
          {
            songs.map((song, index) => (
              <SongListItem key={index} song={song}
              setQueueSongs={setQueueSongs} index={index}/>
            ))
          }
        </div>
    </>
  )
}

export default Songs
