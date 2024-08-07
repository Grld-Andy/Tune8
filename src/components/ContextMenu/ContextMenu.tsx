import React, { useContext } from 'react'
import './style.css'
import { ContextMenuContext } from '../../contexts/ContextMenuContext';
import { CurrentSongContext } from '../../contexts/CurrentSongContext';
import { QueueSongsContext } from '../../contexts/QueueSongsContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import { Link, useLocation, useParams } from 'react-router-dom';
import { PlaylistContext } from '../../contexts/PlaylistsContext';
import { PlaylistFormContext } from '../../contexts/PlaylistFormContext';
import { clearCurrentSongInDatabase, updateCurrentSongInDatabase } from '../../utilities';
import { SongFormContext } from '../../contexts/SongFormContext';

const ContextMenu: React.FC = () => {
  const { contextMenu, contextMenuDispatch } = useContext(ContextMenuContext);
  // close context menu
  const closeMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenuDispatch({ type: 'CLOSE_MENU', payload: {x: 0, y: 0, lastClicked: contextMenu.lastClicked} })
    contextMenuDispatch({type: 'CLEAR_CONTEXT', payload: {x: 0, y: 0, lastClicked: []}})
  }

  // context menu options
  const {currentSong, currentSongDispatch} = useContext(CurrentSongContext)
  const {queue, dispatch} = useContext(QueueSongsContext)
  const {playlists, playlistsDispatch} = useContext(PlaylistContext)
  const location = useLocation()
  const {playlist} = useParams()

  // play song
  const playSong = () => {
    if(location.pathname === '/queue'){
      if(contextMenu.indexClicked){
        currentSongDispatch({type: 'SET_CURRENT_SONG', payload: contextMenu.lastClicked[0], index: contextMenu.indexClicked})
        updateCurrentSongInDatabase(contextMenu.lastClicked[0], contextMenu.indexClicked)
      }
    }else{
      currentSongDispatch({type: 'SET_CURRENT_SONG', payload: contextMenu.lastClicked[0], index: 0})
      updateCurrentSongInDatabase(contextMenu.lastClicked[0], 0)
      dispatch({type: 'SET_QUEUE', payload: contextMenu.lastClicked, index: 0})
    }
  }

  // play next
  const playNextInQueue = () => {
    if(!currentSong.song){
        currentSongDispatch({type: 'SET_CURRENT_SONG', payload: contextMenu.lastClicked[0], index: 0})
        updateCurrentSongInDatabase(contextMenu.lastClicked[0], 0)
    }
    const currentSongQueueID = queue.findIndex(item => item.tag.tags.title === currentSong.song?.tag.tags.title)
    dispatch({type: 'PLAY_NEXT', payload: contextMenu.lastClicked, index: currentSongQueueID})
  }

  // add to playlist
  const {playlistFormDispatch} = useContext(PlaylistFormContext)
  const addToPlaylist = () => {
    playlistFormDispatch({type: 'OPEN_FORM', payload: 'add'})
  }

  // add to queue
  const addToQueue = () => {
    if(!currentSong.song){
        currentSongDispatch({type: 'SET_CURRENT_SONG', payload: contextMenu.lastClicked[0], index: 0})
        updateCurrentSongInDatabase(contextMenu.lastClicked[0], 0)
    }
    dispatch({type: 'ADD_TO_QUEUE', payload: contextMenu.lastClicked, index: currentSong.index})
  }

  // add to favorites
  const {favoritesDispatch} = useContext(FavoritesContext)
  const addToFavorites = () => {
    contextMenu.lastClicked.forEach(async song => {await window.ipcRenderer.updateSongDatabase({...song, isFavorite: true})})
    favoritesDispatch({type: 'ADD_TO_FAVORITES', payload: contextMenu.lastClicked})
  }

  // Edit
  const {songFormDispatch} = useContext(SongFormContext)
  const edit = () => {
    if(location.pathname === '/playlists'){
      playlistFormDispatch({type: 'OPEN_FORM', payload: 'edit', name: contextMenu.nameClicked})
    }else{
      songFormDispatch({type: 'OPEN_FORM', payload: contextMenu.lastClicked[0]})
    }
  }

  const details = () => {
    songFormDispatch({type: 'OPEN_DETAILS', payload: contextMenu.lastClicked[0]})
  }

  // remove options
  const remove = async() => {
    switch(location.pathname){
      case '/queue':
        if(contextMenu.indexClicked || contextMenu.indexClicked === 0){
          if(queue.length > 1){
            let nextIndex = contextMenu.indexClicked + 1
            if(nextIndex >= queue.length) nextIndex = 0
            currentSongDispatch({type: 'SET_CURRENT_SONG', payload: queue[nextIndex], index: nextIndex!==0 ? nextIndex-1 : 0, isPlaying: currentSong.isPlaying})
            updateCurrentSongInDatabase(queue[nextIndex], nextIndex!==0 ? nextIndex-1 : 0)
          }
          else {
            currentSongDispatch({type: 'CLEAR_CURRENT_SONG', payload: null, index: -1, audioRef: null, isPlaying: false})
            clearCurrentSongInDatabase()
          }
          dispatch({type: 'REMOVE_FROM_QUEUE', payload: [], index: contextMenu.indexClicked})
        }
        break
      case '/favorites':
        contextMenu.lastClicked.forEach(async song => {await window.ipcRenderer.updateSongDatabase({...song, isFavorite: false})})
        favoritesDispatch({type: 'REMOVE_FROM_FAVORITES', payload: contextMenu.lastClicked})
        break
      case '/playlists':
        if(contextMenu.nameClicked){
          const playlist = playlists.find(item => item.name === contextMenu.nameClicked)
          if(!playlist)
            break
          await window.ipcRenderer.deletePlaylist(playlist.id)
          playlistsDispatch({type: 'REMOVE_PLAYLIST', payload: {id: playlist.id, name:playlist.name, songs: []}})
        }
        break
      default:
        break
    }
    if(playlist){
        const pList = playlists.find(item => item.name === playlist)
        if(!pList){
          return
        }
        contextMenu.lastClicked.forEach( async (song) => {
          await window.ipcRenderer.removeSongFromPlaylist(song.id, pList.id)
        })
        playlistsDispatch({type: 'REMOVE_FROM_PLAYLIST', payload: {id: pList.id, name: playlist, songs: contextMenu.lastClicked}})
    }
  }
  

  return (
    contextMenu.isOpen ? (
    <>
      <div className="context-overlay" onContextMenu={closeMenu} onClick={closeMenu}></div>
      <div className='context-menu'
      style={{ 
        top: window.innerHeight > contextMenu.position.y + 153 ? contextMenu.position.y: contextMenu.position.y - 118 ,
        left: window.innerWidth/2 > contextMenu.position.x ? contextMenu.position.x : contextMenu.position.x - 130
      }}
      onClick={closeMenu}>
          <div className="labels">
            {
              contextMenu.lastClicked[0] &&
              <>
                <h2 onClick={playSong}>Play Now</h2>
                <h2 onClick={playNextInQueue}>Play Next</h2>
                <h2 className='to-sub'>
                    Add to...
                    <div className='submenu'
                    style={{
                      right: window.innerWidth > contextMenu.position.x + 150 ? -130 : 128
                    }}>
                        <h2 onClick={addToQueue}>Queue</h2>
                        <h2 onClick={addToPlaylist}>Playlist</h2>
                        {
                          location.pathname === '/favorites'||
                          <h2 onClick={addToFavorites}>Favorites</h2>
                        }
                    </div>
                </h2>
              </>
            }
              {
                location.pathname === '/albums' || location.pathname === '/artists'
                || location.pathname === '/queue' || location.pathname === '/favorites'
                || location.pathname === '/playlists' || location.pathname === '/favorites'
                || location.pathname.includes('/playlistView') ||
                <h2 onClick={edit}>Edit</h2>
              }
              {
                location.pathname === '/songs' || location.pathname === '/'
                || location.pathname === '/albums' || location.pathname === '/artists'
                || location.pathname.includes('/albumView') || location.pathname.includes('/artistView') ||
                <h2 onClick={remove}>Remove</h2>
              }
              {
                contextMenu.lastClicked[0] && location.pathname !== '/playlists' &&
                <h2 className='to-sub'>View ...
                  <div className='submenu'
                  style={{
                    right: window.innerWidth > contextMenu.position.x + 150 ? -130 : 128
                  }}>
                    <>
                      <h2>
                        <Link to={`/artistView/${contextMenu.lastClicked[0].tag.tags.artist}`}>Artist</Link>
                      </h2>
                      <h2>
                        <Link to={`/albumView/${contextMenu.lastClicked[0].tag.tags.album}`}>Album</Link>
                      </h2>
                      <h2 onClick={details}>Details</h2>
                    </>
                  </div>
                </h2>
              }
          </div>
      </div>
    </>
    ):null
  )
}

export default ContextMenu
