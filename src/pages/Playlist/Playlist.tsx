import React, { useContext, useState } from 'react'
import './style.css'
import { useLocation, useParams } from 'react-router-dom'
import SongListItem from '../../components/SongListItem/SongListItem'
import { shuffleArray, TotalDuration, updateCurrentSongInDatabase } from '../../utilities'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { PlaylistContext } from '../../contexts/PlaylistsContext'
import { PlaylistInterface, Song } from '../../data'
import AddTo from '../../components/Buttons/AddTo/AddTo'
import { PlaylistFormContext } from '../../contexts/PlaylistFormContext'
import Buttons from '../../components/Buttons/Buttons'

const Playlist: React.FC = () => {
  const {playlist} = useParams<string>()
  const location = useLocation()
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
    updateCurrentSongInDatabase(playlistSongs.songs[0], 0)
    setQueueSongs()
  }
  const shuffleSongs: () => void = () => {
    const newQueue = shuffleArray(playlistSongs.songs)
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: newQueue[0], index: 0, audioRef: new Audio(playlistSongs.songs[0].src), reset: true, isPlaying: true})
    updateCurrentSongInDatabase(newQueue[0], 0)
    dispatch({type: 'SET_QUEUE', payload: newQueue, index: 0})
  }
  const clearPlaylist: () => void = async () => {
    const item = playlists.find(val => val.name === playlist)
    if(playlist && item){
      item.songs.forEach(song => {
        window.ipcRenderer.removeSongFromPlaylist(song.id, item.id).then(() => {
          playlistsDispatch({type: 'CLEAR_PLAYLIST', payload: {id: item.id, name: item.name, songs: []}})
        })
      })
    }
  }
  const edit = () => {
    if(location.pathname.includes('/playlistView/')){
      playlistFormDispatch({type: 'OPEN_FORM', payload: 'edit', name: playlist})
    }
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
      return playlistSongs.songs.filter(item => item.id === songId)
    })
    return selectedSongs
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
            {
              selected.length > 0 &&
              <Buttons selectedSongs={getSelectedSongs()}
              clearSelected={clearSelected}/>
            }
            {
              selected.length > 0 ||
              <>
                <button className="play" onClick={playAllSongs}>Play</button>
                <button className="shuffle" onClick={shuffleSongs}>Shuffle</button>
                <button className="shuffle" onClick={edit}>Edit</button>
                <button className="shuffle" onClick={clearPlaylist}>Clear</button>
                <AddTo selectedSongs={getSelectedSongs()} clearSelected={clearSelected}/>
              </>
            }
          </div>
        </div>
      </div>
      <div className="artist">
        <section>
          <div className="cards">
            {
              playlistSongs.songs.map((song, index) => (
                <SongListItem
                key={index} song={song}
                addToSelected={addToSelected}
                selected={selected}
                removeFromSelected={removeFromSelected}
                setQueueSongs={setQueueSongs}
                index={index}/>
              ))
            }
          </div>
        </section>
      </div>
    </>
  )
}

export default Playlist
