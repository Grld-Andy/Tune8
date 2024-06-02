import React, { useContext } from 'react'
import './style.css'
import { ContextMenuContext } from '../../contexts/ContextMenuContext';
import { CurrentSongContext } from '../../contexts/CurrentSongContext';
import { QueueSongsContext } from '../../contexts/QueueSongsContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import { Link, useLocation, useParams } from 'react-router-dom';
import { PlaylistContext } from '../../contexts/PlaylistsContext';

const ContextMenu: React.FC = () => {
  const { contextMenu, contextMenuDispatch } = useContext(ContextMenuContext);
  // close context menu
  const closeMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenuDispatch({ type: 'CLOSE_MENU', payload: {x: 0, y: 0, lastClicked: []} })
  }

  // context menu options
  const {currentSong, currentSongDispatch} = useContext(CurrentSongContext)
  const {queue, dispatch} = useContext(QueueSongsContext)
  const {playlistsDispatch} = useContext(PlaylistContext)
  const location = useLocation()
  const {playlist} = useParams()
  const playSong = () => {
    if(location.pathname === '/queue'){
      if(contextMenu.indexClicked)
        currentSongDispatch({type: 'SET_CURRENT_SONG', payload: contextMenu.lastClicked[0], index: contextMenu.indexClicked})
    }else{
      currentSongDispatch({type: 'SET_CURRENT_SONG', payload: contextMenu.lastClicked[0], index: 0})
      dispatch({type: 'SET_QUEUE', payload: contextMenu.lastClicked, index: 0})
    }
  }
  const playNextInQueue = () => {
    if(!currentSong.song){
        currentSongDispatch({type: 'SET_CURRENT_SONG', payload: contextMenu.lastClicked[0], index: 0})
    }
    const currentSongQueueID = queue.findIndex(item => item.tag.tags.title === currentSong.song?.tag.tags.title)
    dispatch({type: 'PLAY_NEXT', payload: contextMenu.lastClicked, index: currentSongQueueID})
  }
  const addToQueue = () => {
    if(!currentSong.song){
        currentSongDispatch({type: 'SET_CURRENT_SONG', payload: contextMenu.lastClicked[0], index: 0})
    }
    dispatch({type: 'ADD_TO_QUEUE', payload: contextMenu.lastClicked, index: currentSong.index})
  }
  const {favoritesDispatch} = useContext(FavoritesContext)
  const addToFavorites = () => {
    favoritesDispatch({type: 'ADD_TO_FAVORITES', payload: contextMenu.lastClicked})
  }
  const remove = () => {
    switch(location.pathname){
      case '/queue':
        if(contextMenu.indexClicked || contextMenu.indexClicked === 0){
          if(queue.length > 1){
            let nextIndex = contextMenu.indexClicked + 1
            if(nextIndex >= queue.length) nextIndex = 0
            currentSongDispatch({type: 'SET_CURRENT_SONG', payload: queue[nextIndex], index: nextIndex!==0 ? nextIndex-1 : 0})
          }
          else currentSongDispatch({type: 'CLEAR_CURRENT_SONG', payload: null, index: -1})
          dispatch({type: 'REMOVE_FROM_QUEUE', payload: [], index: contextMenu.indexClicked})
        }
        break
      case '/favorites':
        favoritesDispatch({type: 'REMOVE_FROM_FAVORITES', payload: contextMenu.lastClicked})
        break
      case '/playlists':
        if(contextMenu.nameClicked)
          playlistsDispatch({type: 'REMOVE_PLAYLIST', payload: {name:contextMenu.nameClicked, songs: []}})
        break
      default:
        break
    }
    if(playlist){
      if(playlist)
        playlistsDispatch({type: 'REMOVE_FROM_PLAYLIST', payload: {name: playlist, songs: contextMenu.lastClicked}})
    }
  }
  

  return (
    contextMenu.isOpen ? (
    <>
    <div className="context-overlay" onContextMenu={closeMenu} onClick={closeMenu}></div>
    <div className='context-menu'
    style={{ top: contextMenu.position.y, left: contextMenu.position.x }}
    onClick={closeMenu}>
        <div className="labels">
            <h2 onClick={playSong}>Play Now</h2>
            <h2 onClick={playNextInQueue}>Play Next</h2>
            <h2 className='to-sub'>
                Add to...
                <div className='submenu'>
                    <h2 onClick={addToQueue}>Queue</h2>
                    <h2>Playlist</h2>
                    {
                      location.pathname === '/favorites'||
                      <h2 onClick={addToFavorites}>Favorites</h2>
                    }
                </div>
            </h2>
            {
              location.pathname === '/songs'||
              <h2 onClick={remove}>Remove</h2>
            }
            <h2 className='to-sub'>View ...
                <div className='submenu'>
                    <h2>
                      <Link to={`/artistView/${contextMenu.lastClicked[0].tag.tags.artist}`}>Artist</Link>
                    </h2>
                    <h2>
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
