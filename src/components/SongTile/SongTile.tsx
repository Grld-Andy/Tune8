import React from 'react'
import './style.css'
import { Song } from '../../data'

interface Props{
    song: Song
    page: string
}
const SongTile: React.FC<Props> = ({song, page}) => {
  return (
    <div className="card">
      <div className="pic">
        <img src={song.imageSrc}/>
      </div>
      <div className="lower">
        {
          page === 'albums' ?
          <div className="title">{song.tag.tags.album}</div>:
          <div className="title">{song.tag.tags.title}</div>
        }
        
        <div className="artist">{song.tag.tags.artist}</div>
      </div>
    </div>
  )
}

export default SongTile
