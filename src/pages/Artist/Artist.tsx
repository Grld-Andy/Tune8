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

const Artist: React.FC = () => {
  const {songs} = useContext(AllSongsContext)

  const {artist} = useParams<string>()

  const currentArtist : Song|undefined = songs.find(song => song.tag.tags.artist === artist)
  const artistSongs: Song[] = songs.filter(song => song.tag.tags.artist === artist)
  const uniqueAlbums = artistSongs.map(song => song.tag.tags.album)
  
  const {dispatch} = useContext(QueueSongsContext)
  const {currentSongDispatch} = useContext(CurrentSongContext)
  
  const setQueueSongs = () => {
    dispatch({type: 'SET_QUEUE', payload: artistSongs, index: 0})
  }
  const playAllSongs = () => {
    currentSongDispatch({type: 'SET_CURRENT_SONG', isPlaying: true, payload: artistSongs[0], index: 0, audioRef: new Audio(artistSongs[0].src), reset: true})
    updateCurrentSongInDatabase(artistSongs[0], 0)
    setQueueSongs()
  }
  const shuffleSongs: () => void = () => {
    const newQueue = shuffleArray(artistSongs)
    currentSongDispatch({type: 'SET_CURRENT_SONG', isPlaying: true, payload: newQueue[0], index: 0, audioRef: new Audio(artistSongs[0].src), reset: true})
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
      return artistSongs.filter(item => item.id === songId)
    })
    return selectedSongs
  }

  return (
    <>
      <div className="singles-nav">
        <div className="singles-image circle">
          <img src={currentArtist?.imageSrc}/>
        </div>
        <div className="singles-info">
          <h1>
            {currentArtist?.tag.tags.artist}
          </h1>
          <ul className='h2'>
            <li>{uniqueAlbums.length} {uniqueAlbums.length === 1 ? 'Album' : "Albums"}</li><br/>
            <li>{artistSongs.length} {artistSongs.length === 1 ? 'Song' : "Songs"}</li>
          </ul>
          <div className="others">
            <h4>{TotalDuration(artistSongs)} duration</h4>
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
      <div className="artist">
        <section>
          <div className="cards">
            {
              artistSongs.map((song, index) => (
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

export default Artist
