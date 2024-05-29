import React, { useContext } from 'react'
import './style.css'
import SongListItem from '../../components/SongListItem/SongListItem';
import { QueueSongsContext } from '../../contexts/QueueSongsContext';

const Queue: React.FC = () => {
  const {queue, dispatch} = useContext(QueueSongsContext)

  const clearQueue = () => {
    dispatch({type: 'CLEAR_QUEUE', payload: []})
  }
  const setQueueSongs = () => {
    dispatch({type: 'DEFAULT', payload: queue})
  }

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Queue</h1>
        </div>
        <div className="nav-right">
          <button onClick={clearQueue}>Clear Queue</button>
          <button>Add Files</button>
        </div>
      </nav>
        <div className="songs view">
          {
            queue.map(song => (
              <SongListItem key={song.tag.tags.title} song={song}
              setQueueSongs={setQueueSongs}/>
            ))
          }
        </div>
    </>
  )
}

export default Queue
