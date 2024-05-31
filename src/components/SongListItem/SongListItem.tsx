import React, { useContext } from 'react'
import { BsPlayCircle } from 'react-icons/bs'
import './style.css'
import { Song } from '../../data'
import { Link } from 'react-router-dom'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { ContextMenuContext } from '../../contexts/ContextMenuContext'

interface Props {
  song: Song
  setQueueSongs: () => void
}

const SongListItem: React.FC<Props> = ({song, setQueueSongs}) => {
  const {currentSong, currentSongDispatch} = useContext(CurrentSongContext)
  const playSong = (song: Song) => {
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: song})
    setQueueSongs()
  }

  const {contextMenuDispatch} = useContext(ContextMenuContext)
  const showContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenuDispatch({type: 'OPEN_MENU', payload: {x: e.clientX, y: e.clientY, lastClicked: [song]}})
  }

  return (
    <div
    className={currentSong?.tag.tags.title === song.tag.tags.title ? `song currentSong` : 'song'}
    onContextMenu={showContextMenu}>
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
