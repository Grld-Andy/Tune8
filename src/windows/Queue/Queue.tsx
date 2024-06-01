import React, { useContext } from 'react'
import './style.css'
import SongListItem from '../../components/SongListItem/SongListItem';
import { QueueSongsContext } from '../../contexts/QueueSongsContext';
import { CurrentSongContext } from '../../contexts/CurrentSongContext';
import { shuffleArray } from '../../constants';

const Queue: React.FC = () => {
  const {queue, dispatch} = useContext(QueueSongsContext)
  const {currentSongDispatch} = useContext(CurrentSongContext)

  const clearQueue = () => {
    dispatch({type: 'CLEAR_QUEUE', payload: [], index: 0})
    currentSongDispatch({type: 'CLEAR_CURRENT_SONG', payload: null, index: -1})
  }
  const setQueueSongs = () => {
    dispatch({type: 'DEFAULT', payload: queue, index: 0})
  }
  const shuffleSongs: () => void = () => {
    const newQueue = shuffleArray(queue)
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: newQueue[0], index: 0})
    dispatch({type: 'SET_QUEUE', payload: newQueue, index: 0})
  }

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Queue</h1>
        </div>
        <div className="nav-right">
          <button onClick={clearQueue}>Clear Queue</button>
          <button onClick={shuffleSongs}>Shuffle and Play</button>
          <button>Add Files</button>
        </div>
      </nav>
        <div className="songs view">
          {
            queue.map((song, index) => (
              <SongListItem key={index} song={song}
              setQueueSongs={setQueueSongs} index={index}
              page={'queue'}/>
            ))
          }
        </div>
    </>
  )
}

export default Queue
