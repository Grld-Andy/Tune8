import React, { useContext } from 'react'
import './style.css'
import { useParams } from 'react-router-dom'
import SongListItem from '../../components/SongListItem/SongListItem'
import { shuffleArray, TotalDuration } from '../../utilities'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { PlaylistContext } from '../../contexts/PlaylistsContext'
import { PlaylistInterface } from '../../data'
import AddTo from '../../components/DynamicViews/Buttons/AddTo/AddTo'
import { PlaylistFormContext } from '../../contexts/PlaylistFormContext'

const Playlist: React.FC = () => {
  const {playlist} = useParams<string>()
  const {playlists, playlistsDispatch} = useContext(PlaylistContext)
  const {playlistFormDispatch} = useContext(PlaylistFormContext)
  const playlistSongs: PlaylistInterface = playlists.filter(item => item.name === playlist)[0]
  
  const {dispatch} = useContext(QueueSongsContext)
  const {currentSongDispatch} = useContext(CurrentSongContext)
  
  const setQueueSongs = () => {
    dispatch({type: 'SET_QUEUE', payload: playlistSongs.songs, index: 0})
  }
  const playAllSongs = () => {
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: playlistSongs.songs[0], index: 0, audioRef: new Audio(playlistSongs.songs[0].src), reset: true, isPlaying: true})
    setQueueSongs()
  }
  const shuffleSongs: () => void = () => {
    const newQueue = shuffleArray(playlistSongs.songs)
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: newQueue[0], index: 0, audioRef: new Audio(playlistSongs.songs[0].src), reset: true, isPlaying: true})
    dispatch({type: 'SET_QUEUE', payload: newQueue, index: 0})
  }
  const clearPlaylist: () => void = () => {
    if(playlist)
    playlistsDispatch({type: 'CLEAR_PLAYLIST', payload: {name: playlist, songs: []}})
  }
  const edit = () => {
    if(location.pathname.includes('/playlistView/')){
      playlistFormDispatch({type: 'OPEN_FORM', payload: 'edit', name: playlist})
    }
  }

  return (
    <>
      <div className="singles-nav">
        <div className="singles-image circle">
          <img src={playlistSongs.songs[0] ? playlistSongs.songs[0].imageSrc : playlistSongs.defaultImage}/>
        </div>
        <div className="singles-info">
          <h1>
            {playlistSongs.name}
          </h1>
          <ul className='h2'>
            <li>{playlistSongs.songs.length} {playlistSongs.songs.length === 1 ? 'Song' : "Songs"}</li>
          </ul>
          <div className="others">
            <h4>{TotalDuration(playlistSongs.songs)}</h4>
          </div>
          <div className="buttons">
            <button className="play" onClick={playAllSongs}>Play</button>
            <button className="shuffle" onClick={shuffleSongs}>Shuffle</button>
            <button className="shuffle" onClick={edit}>Edit</button>
            <button className="shuffle" onClick={clearPlaylist}>Clear</button>
            <AddTo selectedSongs={[]} clearSelected={() => {}}/>
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
