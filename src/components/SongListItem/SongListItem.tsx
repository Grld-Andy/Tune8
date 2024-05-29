import React, { useContext } from 'react'
import { BsPlayCircle } from 'react-icons/bs'
import './style.css'
import { Song } from '../../data'
import { Link } from 'react-router-dom'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'

interface Props {
  song: Song
  setQueueSongs: () => void
}

const SongListItem: React.FC<Props> = ({song, setQueueSongs}) => {
  const {currentSong, dispatch} = useContext(CurrentSongContext)

  const playSong = (song: Song) => {
    dispatch({type: 'SET_CURRENT_SONG', payload: song})
    setQueueSongs()
  }

  return (
    <div className={currentSong === song ? `song currentSong` : 'song'}>
      <BsPlayCircle className='icon' onClick={() => {playSong(song)}}/>
      <h3>{song.tag.tags.title}</h3>
      <Link to={`/artistView/${song.tag.tags.artist}`}>
        <h3 className='link'>{song.tag.tags.artist}</h3>
      </Link>
      <Link to={`/albumView/${song.tag.tags.album}`}>
        <h3 className='link'>{song.tag.tags.album}</h3>
      </Link>
      <h3>{song.duration}</h3>
    </div>
  )
}

export default SongListItem
