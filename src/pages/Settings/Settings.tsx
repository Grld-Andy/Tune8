import React, { useContext } from 'react'
import './style.css'
import { ThemeContext } from '../../contexts/ThemeContext'
import { AllSongsContext } from '../../contexts/AllSongsContext'
import { Song } from '../../data'
import AddMusicFolderButton from '../../components/Buttons/AddMusicFolder/AddMusicFolder'

const Settings: React.FC = () => {
  const {dispatch} = useContext(ThemeContext)
  const {songsDispatch} = useContext(AllSongsContext)

  const changeTheme = (type:string) => {
    dispatch({type: `${type}_THEME`})
  }

  const refreshSongs = async() => {
    const musicPath:Array<string> = JSON.parse(localStorage.getItem("MusicPaths") ?? '[]')
    try {
      const allSongs: Array<Song> = []
      musicPath.forEach(async path => {
        const songs: Array<Song> = await window.ipcRenderer.GetSongs(path)
        allSongs.push(...songs)
        songsDispatch({ type: 'SET_SONGS', payload: allSongs })
      })
      
    } catch (error) {
      console.error("Error fetching songs:", error)
    }
  }

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Settings</h1>
        </div>
        <div className="nav-right">
          <button>Add Files</button>
        </div>
      </nav>
      <div className="settings view">
        <section>
          <h2>Music Library</h2>
          <div className="set-grid">
            <div className="set-cell">
              <h3>Music Location</h3>
              <AddMusicFolderButton/>
            </div>
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
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Settings
