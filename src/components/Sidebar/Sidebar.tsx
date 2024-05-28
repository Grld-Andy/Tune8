import React from 'react'
import './style.css'
import { NavLink } from 'react-router-dom'
import {FaHouse, FaMusic } from 'react-icons/fa6'
import {RiPlayListLine} from 'react-icons/ri'
import {MdLibraryMusic, MdOutlinePlaylistPlay, MdPerson, MdFavorite, MdSettings } from 'react-icons/md'
import { profile } from '../../assets'
import { useLocation } from 'react-router-dom'

const Sidebar: React.FC = () => {
  const location = useLocation();
  console.log(location.pathname)
  return (
    <div className='sidebar'>
      <div className="profile">
        <h1>Tune 8</h1>
        <img src={profile}/>
      </div>
      <div className="sidebar-links">
        <div className="upper-links">
          <NavLink className='link' to='/' >
            <div className="icon"><FaHouse title='Home'/></div><h5>Home</h5></NavLink>
          <NavLink className='link' to='songs'>
            <div className="icon"><FaMusic title='Songs'/></div><h5>Songs</h5></NavLink>
          <NavLink className={location.pathname.includes('album') ? 'active link' : 'link'} to='albums'>
            <div className="icon"><MdLibraryMusic title='Albums'/></div><h5>Albums</h5></NavLink>
          <NavLink className={location.pathname.includes('artist') ? 'active link' : 'link'} to='artists'>
            <div className="icon"><MdPerson title='Artists'/></div><h5>Artists</h5></NavLink>
          <NavLink className='link' to='queue'>
            <div className="icon"><MdOutlinePlaylistPlay title='Queue'/></div><h5>Queue</h5></NavLink>
          <NavLink className='link' to='favorites'>
            <div className="icon"><MdFavorite title='Favorites'/></div><h5>Favorites</h5></NavLink>
          <NavLink className='link' to='playlists'>
            <div className="icon"><RiPlayListLine title='Playlist'/></div><h5>Playlists</h5></NavLink>
        </div>
        <div className="lower-links">
          <NavLink className='link' to='settings'>
            <div className="icon"><MdSettings title='Settings'/></div><h5>Settings</h5></NavLink>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
