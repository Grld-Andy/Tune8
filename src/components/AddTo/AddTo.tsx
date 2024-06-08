import React, { useContext, useRef } from 'react'
import './style.css'
import { useLocation, useParams } from 'react-router-dom'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import { PlaylistFormContext } from '../../contexts/PlaylistFormContext'
import FavoritesContext from '../../contexts/FavoritesContext'
import { ContextMenuContext } from '../../contexts/ContextMenuContext'
import { PlaylistContext } from '../../contexts/PlaylistsContext'
import { AllSongsContext } from '../../contexts/AllSongsContext'

const AddTo: React.FC = () => {
  const {songs} = useContext(AllSongsContext)

    // add to view
  const addRef = useRef<HTMLDivElement|null>(null)
  const showAddTo = () => {
    if(addRef.current){
      addRef.current.style.display = 'block'
    }
  }
  const closeAddTo = () => {
    if(addRef.current){
      addRef.current.style.display = 'none'
    }
  }
  
  const {artist, album, playlist} = useParams()
  const location = useLocation()
  const {currentSong, currentSongDispatch} = useContext(CurrentSongContext)
  const {dispatch} = useContext(QueueSongsContext)
  const {playlistFormDispatch} = useContext(PlaylistFormContext)
  const {playlists} = useContext(PlaylistContext)
  const {favoritesDispatch} = useContext(FavoritesContext)
  const {contextMenuDispatch} = useContext(ContextMenuContext)

  // helper function
  const getSongs = () => {
    if(location.pathname.includes('/artistView/')){
      return songs.filter(song => song.tag.tags.artist === artist)
    }
    else if(location.pathname.includes('/albumView/')){
      return songs.filter(song => song.tag.tags.album === album)
    }
    else if(location.pathname.includes('/playlistView/')){
      return playlists.filter(item => item.name === playlist)[0].songs
    }
  }

  // add to queue
  const addToQueue = () => {
    const songsToAdd = getSongs()
    if(songsToAdd){
      if(!currentSong.song){
        currentSongDispatch({type: 'SET_CURRENT_SONG', payload: songsToAdd[0], index: 0})
      }
      dispatch({type: 'ADD_TO_QUEUE', payload: songsToAdd, index: currentSong.index})
    }
    closeAddTo()
  }

  // add to playlist
  const addToPlaylist = () => {
    const songsToAdd = getSongs()
    if(songsToAdd){
      contextMenuDispatch({type: 'CLOSE_MENU', payload: {x: 0, y: 0, lastClicked: songsToAdd, nameClicked: playlist}})
      playlistFormDispatch({type: 'OPEN_FORM', payload: 'add'})
    }
    closeAddTo()
  }

  // add to favorites
  const addToFavorites = () => {
    const songsToAdd = getSongs()
    if(songsToAdd){
      favoritesDispatch({type: 'ADD_TO_FAVORITES', payload: songsToAdd})
    }
    closeAddTo()
  }
  
  return (
    <>
        <button className="add" onClick={showAddTo}>Add to</button>
        <div className="addto-container" ref={addRef} onMouseLeave={closeAddTo}>
            <div className="single_add_to">
                <div onClick={addToQueue}>Queue</div>
                <div onClick={addToPlaylist}>Playlist</div>
                <div onClick={addToFavorites}>Favorites</div>
            </div>
        </div>
    </>
  )
}

export default AddTo
