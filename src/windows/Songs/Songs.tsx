import React from 'react'
import { songs } from '../../assets'
import './style.css'
import SongListItem from '../../components/SongListItem/SongListItem';

const Songs: React.FC = () => {
  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Songs</h1>
        </div>
        <div className="nav-right">
          <button>Add Files</button>
        </div>
      </nav>
        <div className="songs view">
          {
            songs.map(song => (
              <SongListItem key={song.tag.tags.title} song={song}/>
            ))
          }
          {
            songs.map(song => (
              <SongListItem key={song.tag.tags.title} song={song}/>
            ))
          }
          {
            songs.map(song => (
              <SongListItem key={song.tag.tags.title} song={song}/>
            ))
          }
        </div>
    </>
  )
}

export default Songs
