import React, { useContext } from 'react'
import './style.css'
import { songs } from '../../assets'
import { useParams } from 'react-router-dom'
import { Song } from '../../data'
import SongListItem from '../../components/SongListItem/SongListItem'
import { TotalDuration } from '../../constants'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'

const Artist: React.FC = () => {
  const {artist} = useParams<string>()

  const currentArtist : Song|undefined = songs.find(song => song.tag.tags.artist === artist)
  const artistSongs: Song[] = songs.filter(song => song.tag.tags.artist === artist)
  const uniqueAlbums = artistSongs.map(song => song.tag.tags.album)
  
  const {dispatch} = useContext(QueueSongsContext)
  const setQueueSongs = () => {
    dispatch({type: 'SET_QUEUE', payload: artistSongs})
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
            <li>{uniqueAlbums.length} Albums</li><br/>
            <li>{artistSongs.length} Songs</li>
          </ul>
          <div className="others">
            <h4>{TotalDuration(artistSongs)}</h4>
          </div>
          <div className="buttons">
            <button className="play">Play All</button>
            <button className="shuffle">Shuffle and play</button>
            <button className="add">Add to</button>
          </div>
        </div>
      </div>
      <div className="artist">
        <section>
          <div className="cards">
            {
              artistSongs.map(song => (
                <SongListItem key={song.tag.tags.title} song={song}
                setQueueSongs={setQueueSongs}/>
              ))
            }
          </div>
        </section>
      </div>
    </>
  )
}

export default Artist
