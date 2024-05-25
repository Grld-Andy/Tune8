import React from 'react'
import './style.css'
import { songs } from '../../assets'
import { useParams } from 'react-router-dom'
import { Song } from '../../data'
import SongListItem from '../../components/SongListItem/SongListItem'
import { TotalDuration } from '../../constants'

const Album: React.FC = () => {
  const {album} = useParams<string>()
  const currentAlbum : Song|undefined = songs.find(song => song.tag.tags.album === album)
  const albumSongs: Song[] = songs.filter(song => song.tag.tags.album === album)

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
            <button className="play">Play All</button>
            <button className="shuffle">Shuffle and play</button>
            <button className="add">Add to</button>
          </div>
        </div>
      </div>
      <div className="album">
        <section>
          <div className="cards">
            {
              albumSongs.map(song => (
                <SongListItem key={song.tag.tags.title} song={song}/>
              ))
            }
          </div>
        </section>
      </div>
    </>
  )
}

export default Album
