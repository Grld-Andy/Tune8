import React from 'react'
import { BsPlayCircle } from 'react-icons/bs'
import './style.css'
import { Song } from '../../data'

interface Props {
  song: Song
}

const SongListItem: React.FC<Props> = ({song}) => {
  return (
    <div className="song">
      <BsPlayCircle className='icon'/>
      <h3>{song.tag.tags.title}</h3>
      <h3>{song.tag.tags.artist}</h3>
      <h3>{song.tag.tags.album}</h3>
      <h3>{song.duration}</h3>
    </div>
  )
}

export default SongListItem
