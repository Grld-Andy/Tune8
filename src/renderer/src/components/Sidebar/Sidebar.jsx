import React from 'react';
import { useLocation, NavLink, Link } from 'react-router-dom';
import {FaHouse, FaMusic } from 'react-icons/fa6'
import {RiPlayListLine} from 'react-icons/ri'
import {MdLibraryMusic, MdOutlinePlaylistPlay, MdPerson, MdFavorite, MdSettings } from 'react-icons/md'
import { profile } from '../../constants';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    // fix NavLink messing up active link animation
    return (
        <div className='sidebar-root'>
            <div className="profile">
                <h1>Tune8</h1>
                <img src={profile.img} alt='profile image'/>
                <h2>{profile.name}</h2>
            </div>
            <div className="sidebar-mid-content">
                <NavLink to='/'>
                    <div className="icon"><FaHouse title='Home'/></div><h5>Home</h5>
                </NavLink>
                <NavLink to='/songs'>
                    <div className="icon"><FaMusic title='Songs'/></div><h5>Songs</h5>
                </NavLink>
                <NavLink to='/albums' className={currentPath.includes('/album') ? 'active' : ''}>
                    <div className="icon"><MdLibraryMusic title='Albums'/></div><h5>Albums</h5>
                </NavLink>
                <NavLink to='/artists' className={currentPath.includes('/artist') ? 'active' : ''}>
                    <div className="icon"><MdPerson title='Artists'/></div><h5>Artists</h5>
                </NavLink>
                <NavLink to='/queue'>
                    <div className="icon"><MdOutlinePlaylistPlay title='Queue'/></div><h5>Queue</h5>
                </NavLink>
                <NavLink to='/playlist'>
                    <div className="icon"><RiPlayListLine title='Playlist'/></div><h5>Playlist</h5>
                </NavLink>
                <NavLink to='/favorites'>
                    <div className="icon"><MdFavorite title='Favorites'/></div><h5>Favorites</h5>
                </NavLink>
            </div>
            <div className='settings'>
                <NavLink to='/settings' className={currentPath === '/settings' ? 'active' : ''}>
                    <div className="icon"><MdSettings title='Settings'/></div><h5>Settings</h5>
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
