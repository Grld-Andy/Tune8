import React, { useContext } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'
import MusicPlayer from '../MusicPlayer/MusicPlayer'
import './style.css'
import ThemeContext from '../../contexts/ThemeContext'

const WindowLayout: React.FC = () => {
  const {theme} = useContext(ThemeContext)

  return (
    <div className={`main ${theme}`}>
      <div className="left__">
        <Sidebar/>
      </div>
      <div className="right__">
        <Outlet/>
      </div>
      <div className="bottom__">
        <MusicPlayer/>
      </div>
    </div>
  )
}

export default WindowLayout
