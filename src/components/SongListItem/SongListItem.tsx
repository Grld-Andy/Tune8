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
  index: number
  page?: string
}

const resetSongs: () => boolean = () => {
  const pathname = location.pathname
  console.log(pathname)
  if(pathname === '/songs' || pathname === '/favorites'
    || pathname.includes('/playlistView/') || pathname.includes('/albumView/')
    || pathname.includes('/artistView/'))
  return true
  else return false
}
const SongListItem: React.FC<Props> = ({song, setQueueSongs, index, page = 'link'}) => {
  const {currentSong, currentSongDispatch} = useContext(CurrentSongContext)
  const playSong = (song: Song) => {
    const playState = currentSong.song !== song ? true : resetSongs() ? true : currentSong.isPlaying ? false : true
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: song, index: index, isPlaying: playState})
    setQueueSongs()
  }

  const {contextMenuDispatch} = useContext(ContextMenuContext)
  const showContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenuDispatch({type: 'OPEN_MENU', payload: {x: e.clientX, y: e.clientY, lastClicked: [song], indexClicked: index}})
  }

  return (
    <div
    className={currentSong.index === index && page === 'queue' ? `song currentSong` :
    page !== 'queue' && currentSong.song?.tag.tags.title === song.tag.tags.title
      && currentSong.song?.tag.tags.album === song.tag.tags.album ? `song currentSong`:
    'song'}
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
