import React, { useContext, useEffect, useState } from 'react'
import './style.css'
import SongListItem from '../../components/SongListItem/SongListItem';
import { QueueSongsContext } from '../../contexts/QueueSongsContext';
import { CurrentSongContext } from '../../contexts/CurrentSongContext';
import { getSortedSongs, shuffleArray } from '../../utilities';
import { AllSongsContext } from '../../contexts/AllSongsContext';
import MusicNavigation from '../../components/MusicNavigation/MusicNavigation';
import SortButton from '../../components/SortButton/SortButton';
import { SortedSongs } from '../../data';

const Songs: React.FC = () => {
  const {dispatch} = useContext(QueueSongsContext)
  const {songs} = useContext(AllSongsContext)
  const {currentSongDispatch} = useContext(CurrentSongContext)
  const setQueueSongs: () => void = () => {
    dispatch({type: 'SET_QUEUE', payload: songs, index: 0})
  }

  // play all songs
  const playAllSongs: () => void = () => {
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: songs[0], index: 0, reset: true, isPlaying: true})
    setQueueSongs()
  }

  // shuffle songs
  const shuffleSongs: () => void = () => {
    const newQueue = shuffleArray(songs)
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: newQueue[0], index: 0, reset: true, isPlaying: true})
    dispatch({type: 'SET_QUEUE', payload: newQueue, index: 0})
  }

  // navigation
  const [showNav, setShowNav] = useState(false)
  const toggleShowNav: () => void = () => {
    setShowNav(!showNav)
  }
  const closeAndScroll: () => void = () => {
    setShowNav(false)
  }

  // sort songs
  const [sortOrder, setSortOrder] = useState<string>(localStorage.getItem('songsSortOrder') ?? 'title')
  const [sortedSongs, setSortedSongs] = useState<SortedSongs>(getSortedSongs(songs, sortOrder))
  useEffect(() => {
    localStorage.setItem('songsSortOrder', sortOrder)
    setSortedSongs(getSortedSongs(songs, sortOrder))
  }, [sortOrder, songs])

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Songs</h1>
        </div>
        <div className="nav-right">
          <button onClick={playAllSongs}>Play All</button>
          <button onClick={shuffleSongs}>Shuffle and Play</button>
          <SortButton sortOrder={sortOrder} setSortOrder={setSortOrder}
            showNav={showNav}/>
          <button>Add Files</button>
        </div>
      </nav>
        <div className="songs view">
          {
            showNav &&
            <MusicNavigation toggleShowNav={toggleShowNav}
            sortOrder={sortOrder}
            object={sortedSongs} closeAndScroll={closeAndScroll}/>
          }
          {
            Object.keys(sortedSongs).sort().map(letter => (
              <section key={letter} id={letter}>
                <h2 onClick={toggleShowNav}>{letter}</h2>
                  <div className="listItem">
                    {
                      Array.from(sortedSongs[letter]).sort((a, b) => a.tag.tags.album.localeCompare(b.tag.tags.album)).map((song, index) => (
                        <SongListItem key={index} song={song}
                        setQueueSongs={setQueueSongs} index={index}/>
                      ))
                    }
                  </div>
                </section>
              ))
            }
        </div>
    </>
  )
}

export default Songs
