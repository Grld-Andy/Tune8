import React, { useContext } from 'react'
import {IoMdArrowDropup, IoMdArrowDropright} from 'react-icons/io'
import './style.css'
import { Song } from '../../data'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import { songs } from '../../assets'
import { Link } from 'react-router-dom'

interface Props{
    song: Song,
    page: string
}

const SongTileDetails: React.FC<Props> = ({song, page}) => {
  return (
    <div className="lower">
        {
          page === 'album' ?
          <div className="title">{song.tag.tags.album}</div>:
          page === 'artist' ?
          <div className="title">{song.tag.tags.artist}</div>:
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

  const playSong = () => {
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: song})
    if(page === 'album'){
      const albumSongs = songs.filter(item => item.tag.tags.album === song.tag.tags.album)
      dispatch({type: 'SET_QUEUE', payload: albumSongs})
    }else if(page === 'artist'){
      const artistSongs = songs.filter(item => item.tag.tags.artist === song.tag.tags.artist)
      dispatch({type: 'SET_QUEUE', payload: artistSongs})
    }else{
      dispatch({type: 'SET_QUEUE', payload: [song]})
    }
  }

  return (
    <div className="card">
      <div className="tile-icons play_icon">
        <IoMdArrowDropright onClick={playSong} size={40}/>
      </div>
      <div className="tile-icons drop_up">
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
          ?<SongTileDetails song={song} page='page'/>
          :<Link to={`/${page}View/${linkTo}`}><SongTileDetails song={song} page='page'/></Link>
        }
    </div>
  )
}

export default SongTile
