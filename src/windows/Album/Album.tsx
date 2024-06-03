import React, { useContext } from 'react'
import './style.css'
import { songs } from '../../assets'
import { useParams } from 'react-router-dom'
import { Song } from '../../data'
import SongListItem from '../../components/SongListItem/SongListItem'
import { shuffleArray, TotalDuration } from '../../constants'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'

const Album: React.FC = () => {
  const {album} = useParams<string>()

  const currentAlbum : Song|undefined = songs.find(song => song.tag.tags.album === album)
  const albumSongs: Song[] = songs.filter(song => song.tag.tags.album === album)

  const {dispatch} = useContext(QueueSongsContext)
  const {currentSongDispatch} = useContext(CurrentSongContext)
  const setQueueSongs = () => {
    dispatch({type: 'SET_QUEUE', payload: albumSongs, index: 0})
  }
  const playAllSongs = () => {
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: albumSongs[0], index: 0, audioRef: new Audio(albumSongs[0].src), reset: true})
    setQueueSongs()
  }
  const shuffleSongs: () => void = () => {
    const newQueue = shuffleArray(albumSongs)
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: newQueue[0], index: 0, audioRef: new Audio(albumSongs[0].src), reset: true})
    dispatch({type: 'SET_QUEUE', payload: newQueue, index: 0})
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
            <li>{albumSongs.length} Songs</li>
            <li>{TotalDuration(albumSongs)} duration</li>
          </div>
          <div className="buttons">
            <button className="play" onClick={playAllSongs}>Play All</button>
            <button className="shuffle" onClick={shuffleSongs}>Shuffle and Play</button>
            <button className="add">Add to</button>
          </div>
        </div>
      </div>
      <div className="album">
        <section>
          <div className="cards">
            {
              albumSongs.map((song, index) => (
                <SongListItem key={index} song={song}
                setQueueSongs={setQueueSongs} index={index}/>
              ))
            }
          </div>
        </section>
      </div>
    </>
  )
}

export default Album
