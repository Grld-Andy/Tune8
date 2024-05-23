import React from 'react'
import { BsPlayCircle } from 'react-icons/bs'
import './style.css'

interface Props {
  song: {title:string, artist:string, album:string, time:string}
}

const SongListItem: React.FC<Props> = ({song}) => {
  return (
    <div className="song">
      <BsPlayCircle className='icon'/>
      <h3>{song.title}</h3>
      <h3>{song.artist}</h3>
      <h3>{song.album}</h3>
      <h3>{song.time}</h3>
    </div>
  )
}

export default SongListItem
