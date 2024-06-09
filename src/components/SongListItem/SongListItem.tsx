import React, { useContext } from 'react'
import { BsPauseCircle, BsPlayCircle } from 'react-icons/bs'
import './style.css'
import { Song } from '../../data'
import { Link } from 'react-router-dom'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { ContextMenuContext } from '../../contexts/ContextMenuContext'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  song: Song
  setQueueSongs: () => void
  index: number
  page?: string
}

const resetSongs: (index1: number, index2: number) => boolean = (index1, index2) => {
  const pathname = location.pathname
  if(pathname === '/songs' || pathname === '/favorites'
    || pathname.includes('/playlistView/') || pathname.includes('/albumView/')
    || pathname.includes('/artistView/') || index1 !== index2)
  return true
  else return false
}
const SongListItem: React.FC<Props> = ({song, setQueueSongs, index, page = 'link'}) => {
  const {currentSong, currentSongDispatch} = useContext(CurrentSongContext)
  const playSong = (song: Song) => {
    const playState = currentSong.song !== song ? true : resetSongs(currentSong.index, index) ? true : currentSong.isPlaying ? false : true
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: song, index: index, isPlaying: playState, audioRef: new Audio(song.src), reset: resetSongs(currentSong.index, index)})
    setQueueSongs()
  }

  const {contextMenuDispatch} = useContext(ContextMenuContext)
  const showContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenuDispatch({type: 'OPEN_MENU', payload: {x: e.clientX, y: e.clientY, lastClicked: [song], indexClicked: index}})
  }

  // drag and drop
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: song.tag.tags.title })

  const style = {
    transition: transition,
    transform: CSS.Transform.toString(transform),
  }


  return (
    <div
    ref={setNodeRef} {...attributes} {...listeners} style={style}
    className={currentSong.index === index && page === 'queue' ? `song currentSong` :
    page !== 'queue' && currentSong.song?.tag.tags.title === song.tag.tags.title
      && currentSong.song?.tag.tags.album === song.tag.tags.album ? `song currentSong`:
    'song'}
    onContextMenu={showContextMenu}>
      {
        page === 'queue' && currentSong.isPlaying && currentSong.index === index?
        <BsPauseCircle className='icon' onClick={() => {playSong(song)}}/>:
        <BsPlayCircle className='icon' onClick={() => {playSong(song)}}/>
      }
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
