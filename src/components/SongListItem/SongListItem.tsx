import React, { useContext, useEffect, useRef, useState } from 'react'
import { BsPauseCircle, BsPlayCircle } from 'react-icons/bs'
import './style.css'
import { Song } from '../../data'
import { Link } from 'react-router-dom'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { ContextMenuContext } from '../../contexts/ContextMenuContext'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IoMdCheckmark } from 'react-icons/io'
import { updateCurrentSongInDatabase } from '../../utilities'

interface Props {
  song: Song
  setQueueSongs: () => void
  index: number
  page?: string
  addToSelected: (songs: string) => void
  removeFromSelected: (songs: string) => void
  selected: Array<string>
}

const SongListItem: React.FC<Props> = ({ song, setQueueSongs, index, page = 'link', addToSelected, selected, removeFromSelected }) => {

  // helper function to reset songs
  const resetSongs: (index1: number, index2: number) => boolean = (index1, index2) => {
    const pathname = location.pathname
    if (
      pathname === '/songs' || pathname === '/favorites' ||
      pathname.includes('/playlistView/') || pathname.includes('/albumView/') ||
      pathname.includes('/artistView/') || index1 !== index2
    )
      return true
    else return false
  }

  const { currentSong, currentSongDispatch } = useContext(CurrentSongContext)
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragging = useRef(false)

  const playSong = (song: Song) => {
    const playState = currentSong.song !== song ? true : resetSongs(currentSong.index, index) ? true : currentSong.isPlaying ? false : true
    currentSongDispatch({
      type: 'SET_CURRENT_SONG',
      payload: song,
      index: index,
      isPlaying: playState,
      audioRef: new Audio(song.src),
      reset: resetSongs(currentSong.index, index),
    })
    updateCurrentSongInDatabase(song, index)
    setQueueSongs()
  }

  // show context menu
  const { contextMenuDispatch } = useContext(ContextMenuContext)
  const showContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log("song index: ",index)
    contextMenuDispatch({ type: 'OPEN_MENU', payload: { x: e.clientX, y: e.clientY, lastClicked: [song], indexClicked: index } })
  }

  // drag and drop
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id: index })
  const style = {
    transition: 'transform 150ms linear',
    transform: CSS.Transform.toString(transform),
  }
  const handleDragStart = () => {
    dragging.current = true
  }
  const handleDragEnd = () => {
    dragging.current = false
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current)
      clickTimeout.current = null
    }
  }

  // select songs logic
  const [isSelected, setIsSelected] = useState<boolean>(false)
  const handleIsSelected = (val: boolean) => {
    setIsSelected(val)
    if(val){
      addToSelected(song.id)
    }else{
      removeFromSelected(song.id)
    }
  }
  // reset if selected is cleared
  useEffect(() => {
    if(selected.length < 1){
      setIsSelected(false)
    }
  }, [selected])

  return (
      <div
      onContextMenu={showContextMenu}
      style={style}
      className={currentSong.index === index && page === 'queue' ? `song currentSong` :
      page !== 'queue' && currentSong.song?.tag.tags.title === song.tag.tags.title
      && currentSong.song?.tag.tags.album === song.tag.tags.album ? `song currentSong` :
      'song'}>
        {
          page === 'queue' &&
          <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={style}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          className='draggable'
          >
          </div>
        }
        <div className={isSelected ? `select-tile selected show-${selected.length > 0}` : `select-tile show-${selected.length > 0}`}
        onClick={() => {handleIsSelected(!isSelected)}}>
          {
            isSelected &&
            <IoMdCheckmark size={22}/>
          }
        </div>
        {
          page === 'queue' && currentSong.isPlaying && currentSong.index === index ?
            <BsPauseCircle className='icon' onClick={() => { playSong(song) }} /> :
            <BsPlayCircle className='icon' onClick={() => { playSong(song) }} />
        }
        <div className='text'>
          <h3>{song.tag.tags.title}</h3>
        </div>
        <div className='text artist'>
          <Link to={`/artistView/${song.tag.tags.artist}`}>{song.tag.tags.artist}</Link>
        </div>
        <div className='text album'>
          <Link to={`/albumView/${song.tag.tags.album}`}>{song.tag.tags.album}</Link>
        </div>
        <div className='text year'>
          <h3>{song.tag.tags.year}</h3>
        </div>
        <div className='text genre'>
          <h3>{song.tag.tags.genre}</h3>
        </div>
        <div className='text'>
          <h3>{song.duration}</h3>
        </div>
      </div>
  )
}

export default SongListItem
