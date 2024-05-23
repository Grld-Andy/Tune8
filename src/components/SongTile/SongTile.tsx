import React from 'react'
import './style.css'

interface Props{
    song: {title: string, artist: string, album: string, image: string}
    page: string
}
const SongTile: React.FC<Props> = ({song, page}) => {
  return (
    <div className="card">
      <div className="pic">
        <img src={song.image}/>
      </div>
      <div className="lower">
        {
          page === 'albums' ?
          <div className="title">{song.album}</div>:
          <div className="title">{song.title}</div>
        }
        
        <div className="artist">{song.artist}</div>
      </div>
    </div>
  )
}

export default SongTile
