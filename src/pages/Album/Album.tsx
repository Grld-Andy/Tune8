import React, { useContext, useState } from 'react'
import './style.css'
import { useParams } from 'react-router-dom'
import { Song } from '../../data'
import SongListItem from '../../components/SongListItem/SongListItem'
import { shuffleArray, TotalDuration, updateCurrentSongInDatabase } from '../../utilities'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import AddTo from '../../components/Buttons/AddTo/AddTo'
import { AllSongsContext } from '../../contexts/AllSongsContext'
import Buttons from '../../components/Buttons/Buttons'

const Album: React.FC = () => {
  const {songs} = useContext(AllSongsContext)

  const {album} = useParams<string>()

  const currentAlbum : Song|undefined = songs.find(song => song.tag.tags.album === album)
  const albumSongs: Song[] = songs.filter(song => song.tag.tags.album === album)

  const {dispatch} = useContext(QueueSongsContext)
  const {currentSongDispatch} = useContext(CurrentSongContext)
  const setQueueSongs = () => {
    dispatch({type: 'SET_QUEUE', payload: albumSongs, index: 0})
  }
  const playAllSongs = () => {
    currentSongDispatch({type: 'SET_CURRENT_SONG', isPlaying: true, payload: albumSongs[0], index: 0, audioRef: new Audio(albumSongs[0].src), reset: true})
    updateCurrentSongInDatabase(albumSongs[0], 0)
    setQueueSongs()
  }
  const shuffleSongs: () => void = () => {
    const newQueue = shuffleArray(albumSongs)
    currentSongDispatch({type: 'SET_CURRENT_SONG', isPlaying: true, payload: newQueue[0], index: 0, audioRef: new Audio(albumSongs[0].src), reset: true})
    updateCurrentSongInDatabase(newQueue[0], 0)
    dispatch({type: 'SET_QUEUE', payload: newQueue, index: 0})
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
      return albumSongs.filter(item => item.id === songId)
    })
    return selectedSongs
  }

  return (
    <>
      <div className="singles-nav">
        <div className="singles-image">
          <img src={currentAlbum?.imageSrc}/>
        </div>
        <div className="singles-info">
          <h1>
            {currentAlbum?.tag.tags.album}
          </h1>
          <h2>
            {currentAlbum?.tag.tags.artist}
          </h2>
          <div className="others">
            <li>{currentAlbum?.tag.tags.year}</li>
            <li>{albumSongs.length} {albumSongs.length === 1 ? 'Song' : "Songs"}</li>
            <li>{TotalDuration(albumSongs)} duration</li>
          </div>
          <div className="buttons">
            {
              selected.length > 0 &&
              <Buttons selectedSongs={getSelectedSongs()}
              clearSelected={clearSelected}/>
            }
            {
              selected.length > 0 ||
              <>
                <button className="play" onClick={playAllSongs}>Play</button>
                <button className="shuffle" onClick={shuffleSongs}>Shuffle</button>
                <AddTo selectedSongs={getSelectedSongs()} clearSelected={clearSelected}/>
              </>
            }
          </div>
        </div>
      </div>
      <div className="album">
        <section>
          <div className="cards">
            {
              albumSongs.map((song, index) => (
                <SongListItem
                key={index} song={song}
                addToSelected={addToSelected}
                selected={selected}
                removeFromSelected={removeFromSelected}
                setQueueSongs={setQueueSongs}
                index={index}/>
              ))
            }
          </div>
        </section>
      </div>
    </>
  )
}

export default Album
