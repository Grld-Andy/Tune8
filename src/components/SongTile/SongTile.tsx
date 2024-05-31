import React, { useContext } from 'react'
import {IoMdArrowDropup, IoMdArrowDropright} from 'react-icons/io'
import './style.css'
import { Song } from '../../data'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import { songs } from '../../assets'
import { Link } from 'react-router-dom'
import { ContextMenuContext } from '../../contexts/ContextMenuContext'

interface Props{
    song: Song,
    page: string
}

const SongTileDetails: React.FC<Props> = ({song, page}) => {
  console.log('current page: ', page)
  return (
    <div className="lower">
        {
          page === 'album' ?
          <div className="title">{song.tag.tags.album}</div>:
          // page === 'artist' ?
          // <div className="title">{song.tag.tags.artist}</div>:
          <div className="title">{song.tag.tags.title}</div>
        }
        {
          page === 'artist' ||
          <div className="artist">{song.tag.tags.artist}</div>
        }
      </div>
  )
}

const SongTile: React.FC<Props> = ({song, page}) => {
  const {currentSongDispatch} = useContext(CurrentSongContext)
  const {dispatch} = useContext(QueueSongsContext)
  const linkTo: string = page === 'album' ? song.tag.tags.album : page === 'artist' ? song.tag.tags.artist : ''

  const getAllSongs: () => Array<Song> = () => {
    if(page === 'album'){
      const albumSongs = songs.filter(item => item.tag.tags.album === song.tag.tags.album)
      return albumSongs
    }else if(page === 'artist'){
      const artistSongs = songs.filter(item => item.tag.tags.artist === song.tag.tags.artist)
      return artistSongs
    }else{
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
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: song})
    const allSongs: Array<Song> = getAllSongs()
    dispatch({type: 'SET_QUEUE', payload: allSongs, index: 0})
  }

  return (
    <div className="card" onContextMenu={openContextMenu}>
      <div className="tile-icons play_icon">
        <IoMdArrowDropright onClick={playSong} size={40}/>
      </div>
      <div className="tile-icons drop_up" onClick={openContextMenu}>
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
          :<Link to={`/${page}View/${linkTo}`}><SongTileDetails song={song} page={page}/></Link>
        }
    </div>
  )
}

export default SongTile
