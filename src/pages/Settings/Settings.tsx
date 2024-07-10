import React, { useContext, useEffect, useState } from 'react'
import './style.css'
import { ThemeContext } from '../../contexts/ThemeContext'
import { AllSongsContext } from '../../contexts/AllSongsContext'
import { MusicPaths, Song } from '../../data'
import { MdDelete } from "react-icons/md"
import AddMusicFolderButton from '../../components/Buttons/AddMusicFolder/AddMusicFolder'
import { FeedbackContext } from '../../contexts/FeedbackContext'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { PlaylistContext } from '../../contexts/PlaylistsContext'

const Settings: React.FC = () => {
  const {themeDispatch} = useContext(ThemeContext)
  const {songsDispatch} = useContext(AllSongsContext)
  const {feedbackDispatch} = useContext(FeedbackContext)

  const changeTheme = (type:string) => {
    themeDispatch({type: `${type}_THEME`})
  }

  const refreshSongs = async() => {
    try {
      const allSongs: Array<Song> = []
      feedbackDispatch({type: 'LOADER', payload:{text: 'Indexing songs', view: 'loader'}})
      window.ipcRenderer.GetSongs().then((songs) => {
        if(songs.length > 0){
          allSongs.push(...songs)
          songsDispatch({ type: 'SET_SONGS', payload: allSongs })
        }
        feedbackDispatch({type: 'CLOSE_LOADER', payload:{text: '', view: 'close_loader'}})
      })
    } catch (error) {
      console.error("Error fetching songs:", error)
    }
  }

  const { dispatch } = useContext(QueueSongsContext)
  const { currentSong, currentSongDispatch } = useContext(CurrentSongContext)
  const { playlists, playlistsDispatch } = useContext(PlaylistContext)

  const clearAllPlaylists: () => void = async () => {
    feedbackDispatch({type: 'LOADER', payload:{text: 'Deleting', view: 'loader'}})
    playlists.forEach( async (playlist) => {
      window.ipcRenderer.deletePlaylist(playlist.id).then(() => {
        playlistsDispatch({type: 'REMOVE_PLAYLIST', payload: {id: playlist.id, name:playlist.name, songs: []}})
      })
    })
    setTimeout(() => {
      feedbackDispatch({type: 'COMPLETED', payload:{text: 'Deleted', view: 'completed'}})
    }, 1000)
    setTimeout(() => {
      feedbackDispatch({type: 'CLOSE_LOADER', payload:{text: '', view: 'close_completed'}})
    }, 3000)
  }
  const clearQueue: () => void = async () => {
    dispatch({ type: 'CLEAR_QUEUE', payload: [], index: 0 })
    currentSongDispatch({ type: 'TOGGLE_CURRENT_SONG_STATE', payload: null, index: 0, isPlaying: false })
    currentSongDispatch({ type: 'CLEAR_CURRENT_SONG', payload: null, index: -1, audioRef: null, isPlaying: false })
  }
  const clearSongs: () => void = async() => {
    window.ipcRenderer.clearSongs().then(() => {
      songsDispatch({ type: 'CLEAR_SONGS', payload: [] })
    })
  }

  const clearData = async () => {
    localStorage.clear()
    setMusicPaths([])
    clearQueue()
    clearSongs()
    clearAllPlaylists()
  }

  const fetchMusicPath = async () => {
    try {
      const pathsData = await window.ipcRenderer.fetchMusicPaths()
      const paths: Array<MusicPaths> = []
      pathsData.forEach(path => paths.push(path))
      setMusicPaths(paths)
    } catch(err){
      console.error('Failed to fetch music paths:', err)
    }
  }

  // music paths
  const [musicPaths, setMusicPaths] = useState<Array<MusicPaths>>([])
  useEffect(() => {
    const getMusicPaths = async () => {
      try {
        const pathsData = await window.ipcRenderer.fetchMusicPaths()
        const paths: Array<MusicPaths> = []
        pathsData.forEach(path => paths.push(path))
        setMusicPaths(paths)
      } catch(err){
        console.error('Failed to fetch music paths:', err)
      }
    }
    getMusicPaths()
  }, [])

  // remove path
  const removePath = async(path: MusicPaths) => {
    await window.ipcRenderer.removeMusicPath(path.id).then(
      (res) => {
        if(res){
          songsDispatch({ type: 'DELETE_SONGS', payload: [] , path: path.path})
          if(currentSong.song?.src.startsWith(path.path)){
            clearQueue()
          }
        }
      }
    )
    await updatePaths()
  }
  const updatePaths = async() => {
    await fetchMusicPath()
  }

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Settings</h1>
        </div>
        <div className="nav-right">
          <AddMusicFolderButton update={updatePaths}/>
        </div>
      </nav>
      <div className="settings view">
        <section>
          <h2>Music Library</h2>
          <div className="set-grid">
            <div className="set-cell">
              <h3>Music Location</h3>
              <AddMusicFolderButton update={updatePaths}/>
            </div>
            {
              musicPaths.map((path, index) => (
                <div className="set-cell path-cell" key={index}>
                  <h3>{path.path}</h3>
                  <button onClick={() => {removePath(path)}}><MdDelete size={15}/></button>
                </div>
              ))
            }
            <div className="set-cell">
              <h3>Refresh Music</h3>
              <button onClick={refreshSongs}>Refresh</button>
            </div>
          </div>
        </section>
        <section>
          <h2>Personlisation</h2>
          <div className="set-grid">
            <div className="set-cell">
              <h3>Change Theme</h3>
              <div className="themes">
                <div className="black" onClick={() => {changeTheme('DARK')}}></div>
                <div className="white" onClick={() => {changeTheme('LIGHT')}}></div>
                <div className="beige" onClick={() => {changeTheme('BEIGE')}}></div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2>Data</h2>
          <div className="set-grid">
            <div className="set-cell">
              <h3>Delete All Playlists</h3>
              <button onClick={clearAllPlaylists} style={{backgroundColor: 'red'}}>Delete</button>
            </div>
            <div className="set-cell">
              <h3>Delete All Data</h3>
              <button onClick={clearData} style={{backgroundColor: 'red'}}>Delete</button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Settings
