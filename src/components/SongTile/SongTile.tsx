import React, { useContext } from 'react'
import {IoMdArrowDropup, IoMdArrowDropright} from 'react-icons/io'
import './style.css'
import { Song } from '../../data'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import { playlists, songs } from '../../assets'
import { Link } from 'react-router-dom'
import { ContextMenuContext } from '../../contexts/ContextMenuContext'

interface Props{
    song: Song,
    page: string,
    playlistName?: string
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

const SongTile: React.FC<Props> = ({song, page, playlistName}) => {
  const {currentSongDispatch} = useContext(CurrentSongContext)
  const {dispatch} = useContext(QueueSongsContext)
  const linkTo: string|undefined = page === 'album' ? song.tag.tags.album : page === 'artist' ? song.tag.tags.artist : page === 'playlist' ? playlistName : ''

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
    contextMenuDispatch({type: 'OPEN_MENU', payload: {x: e.clientX, y: e.clientY, lastClicked: itemClicked}})
  }

  const playSong = () => {
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: song, index: 0})
    const allSongs: Array<Song> = getAllSongs()
    dispatch({type: 'SET_QUEUE', payload: allSongs, index: 0})
  }

  return (
    <div className="card" onContextMenu={openContextMenu}>
      <div className={`tile-icons play_icon ${page}`}>
        <IoMdArrowDropright onClick={playSong} size={40}/>
      </div>
      <div className={`tile-icons drop_up ${page}`} onClick={openContextMenu}>
        <IoMdArrowDropup size={40}/>
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
          ?<SongTileDetails song={song} page={page}/>
          :<Link to={`/${page}View/${linkTo}`}><SongTileDetails song={song} page={page} playlistName={playlistName}/></Link>
        }
    </div>
  )
}

export default SongTile
