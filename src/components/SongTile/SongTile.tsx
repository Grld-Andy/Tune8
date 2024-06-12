import React, { useContext, useEffect, useState } from 'react'
import {IoMdArrowDropup, IoMdArrowDropright} from 'react-icons/io'
import './style.css'
import { Song } from '../../data'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import { Link } from 'react-router-dom'
import { ContextMenuContext } from '../../contexts/ContextMenuContext'
import { PlaylistContext } from '../../contexts/PlaylistsContext'
import { AllSongsContext } from '../../contexts/AllSongsContext'
import { IoMdCheckmark } from 'react-icons/io'

interface Props{
    song: Song,
    page: string,
    playlistName?: string
    addToSelected: (songs: string) => void
    removeFromSelected: (songs: string) => void
    selected: Array<string>
}

const SongTileDetails: React.FC<Props> = ({song, page, playlistName}) => {
  return (
    <div className="lower">
        {
          page === 'album' ?
          <div className="title">{song.tag.tags.album}</div>:
          page === 'artist' ?
          <div className="title">{song.tag.tags.artist}</div>:
          page === 'playlist' ?
          <div className="title">{playlistName}</div>:
          <div className="title">{song.tag.tags.title}</div>
        }
        {
          page === 'artist' || page === 'playlist' ||
          <div className="artist">{song.tag.tags.artist}</div>
        }
      </div>
  )
}

const SongTile: React.FC<Props> = (
    {song, page, playlistName, addToSelected, selected, removeFromSelected}
  ) => {
  const {songs} = useContext(AllSongsContext)

  const {currentSongDispatch} = useContext(CurrentSongContext)
  const {dispatch} = useContext(QueueSongsContext)
  const linkTo: string|undefined = page === 'album' ? song.tag.tags.album : page === 'artist' ? song.tag.tags.artist : page === 'playlist' ? playlistName : ''

  // helper function to get all songs
  const {playlists} = useContext(PlaylistContext)
  const getAllSongs: () => Array<Song> = () => {
    if(page === 'album'){
      const albumSongs = songs.filter(item => item.tag.tags.album === song.tag.tags.album)
      return albumSongs
    }else if(page === 'artist'){
      const artistSongs = songs.filter(item => item.tag.tags.artist === song.tag.tags.artist)
      return artistSongs
    }else if(page === 'playlist'){
      const playlistSongs = playlists.filter(playlist => playlist.name === playlistName)[0]
      return [...playlistSongs.songs]
    }
    else{
      return [song]
    }
  }

  const {contextMenuDispatch} = useContext(ContextMenuContext)
  const openContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    const itemClicked = getAllSongs()
    console.log(itemClicked)
    contextMenuDispatch({type: 'OPEN_MENU', payload: {x: e.clientX, y: e.clientY, lastClicked: itemClicked, nameClicked: playlistName}})
  }

  const playSong = () => {
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: song, index: 0, isPlaying: true, reset:true})
    const allSongs: Array<Song> = getAllSongs()
    dispatch({type: 'SET_QUEUE', payload: allSongs, index: 0})
  }

  // select song logic
  const [isSelected, setIsSelected] = useState<boolean>(false)
  const handleIsSelected = (val: boolean) => {
    setIsSelected(val)
    if(val){
      if(page === 'album'){
        addToSelected(song.tag.tags.album)
      }else if(page === 'artist'){
        addToSelected(song.tag.tags.artist)
      }else if(page === 'home'){
        addToSelected(song.id)
      }else if(page === 'playlist' && playlistName){
        addToSelected(playlistName)
      }
    }else{
      if(page === 'album'){
        removeFromSelected(song.tag.tags.album)
      }else if(page === 'artist'){
        removeFromSelected(song.tag.tags.artist)
      }else if(page === 'home'){
        removeFromSelected(song.id)
      }else if(page === 'playlist' && playlistName){
        removeFromSelected(playlistName)
      }
    }
  }

  // reset if selected is cleared
  useEffect(() => {
    if(selected.length < 1){
      setIsSelected(false)
    }
  }, [selected])

  return (
    <div className="card" onContextMenu={openContextMenu}>
      <div className={`tile-icons play_icon ${page}`}>
        <IoMdArrowDropright onClick={playSong} size={40}/>
      </div>
      <div className={`tile-icons drop_up ${page}`} onClick={openContextMenu}>
        <IoMdArrowDropup size={40}/>
      </div>
      <div className={isSelected ? `select-tile selected show-${selected.length > 0}` : `select-tile show-${selected.length > 0}`}
        onClick={() => {handleIsSelected(!isSelected)}}>
          {
            isSelected &&
            <IoMdCheckmark size={22}/>
          }
        </div>
      <div className={`pic ${page}-page`}>
        {
          page === 'home'
          ?<img src={song.imageSrc}/>
          :<Link to={`/${page}View/${linkTo}`}><img src={song.imageSrc}/></Link>
        }
        <div className="song-tile-overlay"></div>
      </div>
      {
          page === 'home'
          ?<SongTileDetails song={song} page={page}
            removeFromSelected={removeFromSelected}
            addToSelected={addToSelected} selected={selected}/>
          :<Link to={`/${page}View/${linkTo}`}>
            <SongTileDetails song={song} page={page}
            playlistName={playlistName} selected={selected}
            removeFromSelected={removeFromSelected}
            addToSelected={addToSelected}/>
          </Link>
        }
    </div>
  )
}

export default SongTile
