import React, { useContext } from 'react'
import './style.css'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { shuffleArray } from '../../utilities'
import { closestCorners, DndContext, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import SongListItem from '../../components/SongListItem/SongListItem'

const Queue: React.FC = () => {
  const { queue, dispatch } = useContext(QueueSongsContext)
  const { currentSong, currentSongDispatch } = useContext(CurrentSongContext)

  const clearQueue = () => {
    dispatch({ type: 'CLEAR_QUEUE', payload: [], index: 0 })
    currentSongDispatch({ type: 'TOGGLE_CURRENT_SONG_STATE', payload: null, index: 0, isPlaying: false })
    currentSongDispatch({ type: 'CLEAR_CURRENT_SONG', payload: null, index: -1, audioRef: null, isPlaying: false })
  }

  const setQueueSongs = () => {
    dispatch({ type: 'DEFAULT', payload: queue, index: 0 })
  }

  const shuffleSongs = () => {
    const newQueue = shuffleArray(queue)
    currentSongDispatch({ type: 'SET_CURRENT_SONG', payload: newQueue[0], index: 0 })
    dispatch({ type: 'SET_QUEUE', payload: newQueue, index: 0 })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = Number(active.id)
      const newIndex = Number(over?.id)
      const newQueue = arrayMove(queue, oldIndex, newIndex)
      dispatch({ type: 'SET_QUEUE', payload: newQueue, index: currentSong.index })

      // Update the current song index if it was moved
      if (currentSong.index === oldIndex) {
        currentSongDispatch({ type: 'SET_CURRENT_SONG', payload: newQueue[newIndex], index: newIndex })
      } else if (currentSong.index > oldIndex && currentSong.index <= newIndex) {
        // If the current song index is after the old index and before the new index, it should decrement by 1
        const updatedIndex = currentSong.index - 1
        currentSongDispatch({ type: 'SET_CURRENT_SONG', payload: newQueue[updatedIndex], index: updatedIndex })
      } else if (currentSong.index < oldIndex && currentSong.index >= newIndex) {
        // If the current song index is before the old index and after the new index, it should increment by 1
        const updatedIndex = currentSong.index + 1
        currentSongDispatch({ type: 'SET_CURRENT_SONG', payload: newQueue[updatedIndex], index: updatedIndex })
      }
    }
  }

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Queue</h1>
        </div>
        <div className="nav-right">
          <button onClick={clearQueue}>Clear Queue</button>
          <button onClick={shuffleSongs}>Shuffle and Play</button>
          <button>Add Files</button>
        </div>
      </nav>
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="queue view">
          <SortableContext items={queue.map((_, index) => index)} strategy={verticalListSortingStrategy}>
            {queue.map((song, index) => (
              <SongListItem
              key={index}
              song={song}
              setQueueSongs={setQueueSongs}
              index={index}
              page={'queue'} />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </>
  )
}

export default Queue
