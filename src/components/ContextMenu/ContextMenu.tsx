import React, { useContext } from 'react'
import './style.css'
import { ContextMenuContext } from '../../contexts/ContextMenuContext';
import { CurrentSongContext } from '../../contexts/CurrentSongContext';
import { QueueSongsContext } from '../../contexts/QueueSongsContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import { Link } from 'react-router-dom';

const ContextMenu: React.FC = () => {
  const { contextMenu, contextMenuDispatch } = useContext(ContextMenuContext);
  const closeMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenuDispatch({ type: 'CLOSE_MENU', payload: {x: 0, y: 0, lastClicked: []} })
  }

  const {currentSong, currentSongDispatch} = useContext(CurrentSongContext)
  const {queue, dispatch} = useContext(QueueSongsContext)
  const playSong = () => {
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: contextMenu.lastClicked[0]})
    dispatch({type: 'SET_QUEUE', payload: contextMenu.lastClicked, index: 0})
  }
  const playNextInQueue = () => {
    if(!currentSong){
        currentSongDispatch({type: 'SET_CURRENT_SONG', payload: contextMenu.lastClicked[0]})
    }
    const currentSongQueueID = queue.findIndex(item => item.tag.tags.title === currentSong?.tag.tags.title)
    dispatch({type: 'PLAY_NEXT', payload: contextMenu.lastClicked, index: currentSongQueueID})
  }
  const addToQueue = () => {
    if(!currentSong){
        currentSongDispatch({type: 'SET_CURRENT_SONG', payload: contextMenu.lastClicked[0]})
    }
    dispatch({type: 'ADD_TO_QUEUE', payload: contextMenu.lastClicked, index: 0})
  }
  const {favoritesDispatch} = useContext(FavoritesContext)
  const addToFavorites = () => {
    favoritesDispatch({type: 'ADD_TO_FAVORITES', payload: contextMenu.lastClicked})
  }
  

  return (
    contextMenu.isOpen ? (
    <>
    <div className="context-overlay" onContextMenu={closeMenu} onClick={closeMenu}></div>
    <div className='context-menu'
    style={{ top: contextMenu.position.y, left: contextMenu.position.x }}
    onClick={closeMenu}>
        <div className="labels">
            <h2 className='start-context' onClick={playSong}>Play Now</h2>
            <h2 onClick={playNextInQueue}>Play Next</h2>
            <h2 className='to-sub'>
                Add to...
                <div className='submenu'>
                    <h2 className='start-context' onClick={addToQueue}>Queue</h2>
                    <h2>Playlist</h2>
                    <h2 className='end-context' onClick={addToFavorites}>Favorites</h2>
                </div>
            </h2>
            <h2 className='to-sub end-context'>View ...
                <div className='submenu'>
                    <h2 className='start-context'>
                      <Link to={`/artistView/${contextMenu.lastClicked[0].tag.tags.artist}`}>Artist</Link>
                    </h2>
                    <h2 className='end-context'>
                      <Link to={`/albumView/${contextMenu.lastClicked[0].tag.tags.album}`}>Album</Link>
                    </h2>
                </div>
            </h2>
        </div>
    </div>
    </>
    ):null
  )
}

export default ContextMenu
