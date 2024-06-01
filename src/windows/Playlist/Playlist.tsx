import React, { useContext } from 'react'
import './style.css'
import { PlaylistInterface, playlists } from '../../assets'
import { useParams } from 'react-router-dom'
import SongListItem from '../../components/SongListItem/SongListItem'
import { shuffleArray, TotalDuration } from '../../constants'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'

const Playlist: React.FC = () => {
  const {playlist} = useParams<string>()
  const playlistSongs: PlaylistInterface = playlists.filter(item => item.name === playlist)[0]
  
  const {dispatch} = useContext(QueueSongsContext)
  const {currentSongDispatch} = useContext(CurrentSongContext)
  
  const setQueueSongs = () => {
    dispatch({type: 'SET_QUEUE', payload: playlistSongs.songs, index: 0})
  }
  const playAllSongs = () => {
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: playlistSongs.songs[0], index: 0})
    setQueueSongs()
  }
  const shuffleSongs: () => void = () => {
    const newQueue = shuffleArray(playlistSongs.songs)
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: newQueue[0], index: 0})
    dispatch({type: 'SET_QUEUE', payload: newQueue, index: 0})
  }

  return (
    <>
      <div className="singles-nav">
        <div className="singles-image circle">
          <img src={playlistSongs.songs[0]?.imageSrc}/>
        </div>
        <div className="singles-info">
          <h1>
            {playlistSongs.name}
          </h1>
          <ul className='h2'>
            <li>{playlistSongs.songs.length} Songs</li>
          </ul>
          <div className="others">
            <h4>{TotalDuration(playlistSongs.songs)}</h4>
          </div>
          <div className="buttons">
            <button className="play" onClick={playAllSongs}>Play All</button>
            <button className="shuffle" onClick={shuffleSongs}>Shuffle and Play</button>
            <button className="add">Add to</button>
          </div>
        </div>
      </div>
      <div className="artist">
        <section>
          <div className="cards">
            {
              playlistSongs.songs.map((song, index) => (
                <SongListItem key={index} song={song}
                setQueueSongs={setQueueSongs} index={index}/>
              ))
            }
          </div>
        </section>
      </div>
    </>
  )
}

export default Playlist