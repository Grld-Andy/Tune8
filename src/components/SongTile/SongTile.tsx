import React, { useContext } from 'react'
import {IoMdArrowDropup, IoMdArrowDropright} from 'react-icons/io'
import './style.css'
import { Song } from '../../data'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import { songs } from '../../assets'

interface Props{
    song: Song,
    page: string
}

const SongTile: React.FC<Props> = ({song, page}) => {
  const {currentSongDispatch} = useContext(CurrentSongContext)
  const {dispatch} = useContext(QueueSongsContext)

  const playSong = () => {
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: song})
    if(page === 'albums'){
      const albumSongs = songs.filter(item => item.tag.tags.album === song.tag.tags.album)
      dispatch({type: 'SET_QUEUE', payload: albumSongs})
    }else if(page === 'artists'){
      const artistSongs = songs.filter(item => item.tag.tags.artist === song.tag.tags.artist)
      dispatch({type: 'SET_QUEUE', payload: artistSongs})
    }else{
      dispatch({type: 'SET_QUEUE', payload: [song]})
    }
    
  }

  return (
    <div className="card">
      <div className={`pic ${page}-page`}>
        <img src={song.imageSrc}/>
        <div className="song-tile-overlay"></div>
        <div className="tile-icons play_icon">
          <IoMdArrowDropright onClick={playSong} size={40}/>
        </div>
        <div className="tile-icons drop_up">
          <IoMdArrowDropup size={40}/>
        </div>
      </div>
      <div className="lower">
        {
          page === 'albums' ?
          <div className="title">{song.tag.tags.album}</div>:
          page === 'artists' ?
          <div className="title">{song.tag.tags.artist}</div>:
          <div className="title">{song.tag.tags.title}</div>
        }
        {
          page === 'artists' ||
          <div className="artist">{song.tag.tags.artist}</div>
        }
      </div>
    </div>
  )
}

export default SongTile
