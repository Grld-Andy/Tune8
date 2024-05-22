import React, {useState, useEffect} from 'react'
import { Outlet } from "react-router-dom";

import Sidebar from './components/Sidebar/Sidebar'
import Now_Playing from './components/Now_Playing/Now_Playing'

const Layout = ({isPlaying, PlayPause, audioElem, nextSong, prevSong,
    musicProgress, setMusicProgress, currentSong, theme, queueSongs,
    currentIndex, favoriteSongs, setFavoriteSongs, allSongs,
    setAllSongs, setCurrentSong, handleContextMenu,
    handleMenuItemClick, contextMenuPosition, contextMenuVisible}) => {

    return (
        <main className={`main ${theme}`}>
            {
                allSongs.length === 0 &&
                <div className='indexing'>
                    <h2>Indexing songs, please wait</h2>
                </div>
            }
            {contextMenuVisible && 
                <div className="context-overlay" onClick={() => handleMenuItemClick("Clear")}></div>
            }
            <div className="left">
                <Sidebar/>
            </div>
            <div className='right'>
                <Outlet/>
                <Now_Playing isPlaying={isPlaying} PlayPause={PlayPause}
                    audioElem={audioElem} musicProgress={musicProgress}
                    setMusicProgress={setMusicProgress} currentSong={currentSong}
                    nextSong={nextSong} prevSong={prevSong} allSongs={allSongs}
                    queueSongs={queueSongs} currentIndex={currentIndex}
                    favoriteSongs={favoriteSongs} setFavoriteSongs={setFavoriteSongs}
                    setAllSongs={setAllSongs} setCurrentSong={setCurrentSong}/>
            </div>
        </main>
    )
}

export default Layout