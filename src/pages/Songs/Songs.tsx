import React, { useContext, useEffect, useState } from 'react'
import SongListItem from '../../components/SongListItem/SongListItem'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { getSortedSongs, shuffleArray, updateCurrentSongInDatabase } from '../../utilities'
import { AllSongsContext } from '../../contexts/AllSongsContext'
import MusicNavigation from '../../components/MusicNavigation/MusicNavigation'
import SortButton from '../../components/SortButton/SortButton'
import { Song, SortedSongs } from '../../data'
import Buttons from '../../components/Buttons/Buttons'
import AddMusicFolderButton from '../../components/Buttons/AddMusicFolder/AddMusicFolder'
import './style.css'

const Songs: React.FC = () => {
  const {dispatch} = useContext(QueueSongsContext)
  const {songs} = useContext(AllSongsContext)
  const {currentSongDispatch} = useContext(CurrentSongContext)
  const setQueueSongs: () => void = () => {
    dispatch({type: 'SET_QUEUE', payload: getFlatSortedSongs(), index: 0})
  }

  // play all songs
  const playAllSongs: () => void = () => {
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: songs[0], index: 0, reset: true, isPlaying: true})
    updateCurrentSongInDatabase(songs[0], 0)
    setQueueSongs()
  }

  // shuffle songs
  const shuffleSongs: () => void = () => {
    const newQueue = shuffleArray(songs)
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: newQueue[0], index: 0, reset: true, isPlaying: true})
    updateCurrentSongInDatabase(newQueue[0], 0)
    dispatch({type: 'SET_QUEUE', payload: newQueue, index: 0})
  }

  // navigation
  const [showNav, setShowNav] = useState(false)
  const toggleShowNav: () => void = () => {
    setShowNav(!showNav)
  }
  const closeAndScroll = (letter: string) => {
    document.getElementById(letter)?.scrollIntoView({ behavior: 'smooth' })
    setShowNav(false)
  }

  // sort songs
  const [sortOrder, setSortOrder] = useState<string>(localStorage.getItem('songsSortOrder') ?? 'title')
  const [sortedSongs, setSortedSongs] = useState<SortedSongs>(getSortedSongs(songs, sortOrder))
  useEffect(() => {
    localStorage.setItem('songsSortOrder', sortOrder)
    setSortedSongs(getSortedSongs(songs, sortOrder))
  }, [sortOrder, songs])

  const getFlatSortedSongs = (): Array<Song> => {
    return Object.keys(sortedSongs).sort().reduce((acc, letter) => {
      const sortedSongsForLetter = Array.from(sortedSongs[letter])
        .sort((a, b) => a.tag.tags.album.localeCompare(b.tag.tags.album))
      return acc.concat(sortedSongsForLetter)
    }, [] as Array<Song>)
  }

  // mulit select
  const [selected, setSelected] = useState<Array<string>>([])
  const addToSelected = (Group: string) => {
    setSelected([...selected, Group])
  }
  const removeFromSelected = (Group: string) => {
    setSelected(selected.filter(item => item!== Group))
  }
  const clearSelected = () => {
    setSelected([])
  }
  // helper function to get selected songs
  const getSelectedSongs: () => Array<Song> = () => {
    const selectedSongs: Array<Song> = selected.flatMap(songId => {
      return songs.filter(item => item.id === songId)
    })
    return selectedSongs
  }

  // Logic to generate the list of songs with continuous indexing
  let songIndex = 0
  const sortedSongSections = Object.keys(sortedSongs).sort().map(letter => (
    <section key={letter} id={letter}>
      <h2 onClick={toggleShowNav}>{letter}</h2>
      <div className="listItem">
          {
            Array.from(sortedSongs[letter])
            .sort((a, b) => a.tag.tags.album.localeCompare(b.tag.tags.album))
            .map((song) => (
              <SongListItem
              key={songIndex}
              song={song} setQueueSongs={setQueueSongs}
              index={songIndex++}
              addToSelected={addToSelected}
              selected={selected}
              removeFromSelected={removeFromSelected}
              />
            ))
          }
      </div>
    </section>
  ))

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Songs</h1>
        </div>
        <div className="nav-right">
          {
            selected.length > 0 &&
            <Buttons selectedSongs={getSelectedSongs()}
            clearSelected={clearSelected}/>
          }
          {
            selected.length > 0 ||
            <>
              <button onClick={playAllSongs}>Play All</button>
              <button onClick={shuffleSongs}>Shuffle and Play</button>
              <SortButton sortOrder={sortOrder} setSortOrder={setSortOrder}
                showNav={showNav}/>
              <AddMusicFolderButton text={'Add +'}/>
            </>
          }
        </div>
      </nav>
      {
        songs.length > 0?
        <div className="songs view">
          {
            showNav &&
            <MusicNavigation toggleShowNav={toggleShowNav}
            sortOrder={sortOrder}
            object={sortedSongs} closeAndScroll={closeAndScroll}/>
          }
          {sortedSongSections}
        </div>:
        <div className="empty-window view">
          <div className="cell">
            <h1>No songs</h1>
            <AddMusicFolderButton text={'Add +'}/>
          </div>
        </div>
      }
        
    </>
  )
}

export default Songs
