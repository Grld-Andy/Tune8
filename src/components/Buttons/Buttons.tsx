import React, { useContext } from 'react'
import AddTo from './AddTo/AddTo'
import { Song } from '../../data'
import {CurrentSongContext} from '../../contexts/CurrentSongContext'
import {QueueSongsContext} from '../../contexts/QueueSongsContext'

interface Props{
    selectedSongs: Array<Song>
    clearSelected: () => void
}

const Buttons:React.FC<Props> = ({selectedSongs, clearSelected}) => {
    // button functions
  const { currentSong, currentSongDispatch } = useContext(CurrentSongContext)
  const { queue, dispatch } = useContext(QueueSongsContext)
  
  const playAll: () => void = () => {
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: selectedSongs[0], index: 0, isPlaying: true})
    dispatch({type: 'SET_QUEUE', payload: selectedSongs, index: 0})
    clearSelected()
  }
  const playNext: () => void = () => {
    if(!currentSong.song){
      currentSongDispatch({type: 'SET_CURRENT_SONG', payload: selectedSongs[0], index: 0})
    }
    const currentSongQueueID = queue.findIndex(item => item.tag.tags.title === currentSong.song?.tag.tags.title)
    dispatch({type: 'PLAY_NEXT', payload: selectedSongs, index: currentSongQueueID})
    clearSelected()
  }

  return (
    <>
        <button onClick={playAll}>Play All</button>
        <button onClick={playNext}>Play Next</button>
        <AddTo selectedSongs={selectedSongs} clearSelected={clearSelected}/>
        <button onClick={clearSelected}>Clear All</button>
    </>
  )
}

export default Buttons
