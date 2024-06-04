import React, { useContext, useState } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'
import MusicPlayer from '../MusicPlayer/MusicPlayer'
import './style.css'
import {ThemeContext} from '../../contexts/ThemeContext'
import ContextMenu from '../ContextMenu/ContextMenu'
import LyricsView from '../LyricsView/LyricsView'

const WindowLayout: React.FC = () => {
  // theme
  const {theme} = useContext(ThemeContext)

  // handle lyrics display
  const [showLyrics, setShowLyrics] = useState<boolean>(false)
  const displayLyrics = () => {
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
      <LyricsView showLyrics={showLyrics}/>
    </div>
  )
}

export default WindowLayout
