import React, { useContext, useRef, useState } from 'react'
import './style.css'
import { NavLink, useNavigate } from 'react-router-dom'
import {FaHouse, FaMusic } from 'react-icons/fa6'
import {RiPlayListLine, RiSearch2Line} from 'react-icons/ri'
import {MdLibraryMusic, MdOutlinePlaylistPlay, MdPerson, MdFavorite, MdSettings } from 'react-icons/md'
import { profile } from '../../assets'
import { useLocation } from 'react-router-dom'
import { SearchContext } from '../../contexts/SearchContext'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // search results
  const {searchDispatch} = useContext(SearchContext)
  const [search, setSearch] = useState<string>('')
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if(search){
      searchDispatch({type: 'SET_QUERY', payload: search})
      hideInput()
      navigate(`search/${search}`)
    }
    else{
      hideInput()
    }
  }
  const handleSearchInput = (val: string) => {
    setSearch(val)
  }

  // change sidebar width on search
  const sidebarRef = useRef<HTMLDivElement|null>(null)
  const inputRef = useRef<HTMLInputElement|null>(null)
  const searchRef = useRef<HTMLButtonElement|null>(null)
  const showInput = () => {
    if(sidebarRef.current && inputRef.current && searchRef.current){
      sidebarRef.current.classList.add('expanded')
      // sidebarRef.current.style.width = '200px'
      inputRef.current.style.display = 'block'
      inputRef.current.focus()
      searchRef.current.style.display = 'none'
    }
  }
  const hideInput = () => {
    if(sidebarRef.current && inputRef.current && searchRef.current){
      sidebarRef.current.classList.remove('expanded')
      // sidebarRef.current.style.width = '55px'
      if(window.innerWidth <= 700){
        inputRef.current.style.display = 'none'
        searchRef.current.style.display = 'block'
      }
    }
  }

  return (
    <div className='sidebar' ref={sidebarRef}>
      <div className="profile">
        <h1>Tune 8</h1>
        <img src={profile}/>
        <div className="search">
          <form onSubmit={handleSearch}>
            <input type="text" value={search}
            ref={inputRef} onBlur={hideInput}
            placeholder='Search song here...'
            onChange={(e) => {handleSearchInput(e.target.value)}}/>
          </form>
          <button className='search-button'
          ref={searchRef} onClick={showInput}>
            <RiSearch2Line className='search-icon'/>
          </button>
        </div>
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
          <NavLink className={location.pathname.includes('playlist') ? 'active link' : 'link'} to='playlists'>
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
