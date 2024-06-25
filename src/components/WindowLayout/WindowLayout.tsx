import React, { useContext, useState } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'
import MusicPlayer from '../MusicPlayer/MusicPlayer'
import './style.css'
import {ThemeContext} from '../../contexts/ThemeContext'
import ContextMenu from '../ContextMenu/ContextMenu'
import LyricsView from '../LyricsView/LyricsView'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import PlaylistForm from '../PlaylistForm/PlaylistForm'
import Loaders from '../Loaders/Loaders'

const WindowLayout: React.FC = () => {
  // theme
  const {theme} = useContext(ThemeContext)
  const {currentSong} = useContext(CurrentSongContext)

  // handle lyrics display
  const [showLyrics, setShowLyrics] = useState<boolean>(false)
  const displayLyrics = () => {
    if(currentSong.song)
      setShowLyrics(!showLyrics)
  }

  return (
    <div className={`main ${theme}`}>
      <div className="left__">
        <Sidebar/>
      </div>
      <div className="right__">
        <Outlet/>
      </div>
      <div className="bottom__">
        <MusicPlayer displayLyrics={displayLyrics} showLyrics={showLyrics}/>
      </div>
      <ContextMenu/>
      <PlaylistForm/>
      <LyricsView showLyrics={showLyrics}/>
      <Loaders/>
    </div>
  )
}

export default WindowLayout
