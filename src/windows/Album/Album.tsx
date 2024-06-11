import React, { useContext } from 'react'
import './style.css'
import { useParams } from 'react-router-dom'
import { Song } from '../../data'
import SongListItem from '../../components/SongListItem/SongListItem'
import { shuffleArray, TotalDuration } from '../../utilities'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import AddTo from '../../components/DynamicViews/Buttons/AddTo/AddTo'
import { AllSongsContext } from '../../contexts/AllSongsContext'

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
    setQueueSongs()
  }
  const shuffleSongs: () => void = () => {
    const newQueue = shuffleArray(albumSongs)
    currentSongDispatch({type: 'SET_CURRENT_SONG', isPlaying: true, payload: newQueue[0], index: 0, audioRef: new Audio(albumSongs[0].src), reset: true})
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
            <li>{albumSongs.length} {albumSongs.length === 1 ? 'Song' : "Songs"}</li>
            <li>{TotalDuration(albumSongs)} duration</li>
          </div>
          <div className="buttons">
            <button className="play" onClick={playAllSongs}>Play</button>
            <button className="shuffle" onClick={shuffleSongs}>Shuffle</button>
            <AddTo selectedSongs={[]}  clearSelected={() => {}}/>
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
