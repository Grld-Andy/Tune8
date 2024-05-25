import React from 'react'
import { BsPlayCircle } from 'react-icons/bs'
import './style.css'
import { Song } from '../../data'
import { Link } from 'react-router-dom'

interface Props {
  song: Song
}

const SongListItem: React.FC<Props> = ({song}) => {
  return (
    <div className="song">
      <BsPlayCircle className='icon'/>
      <h3>{song.tag.tags.title}</h3>
      <Link to={`/artistView/${song.tag.tags.artist}`}>
        <h3 className='link'>{song.tag.tags.artist}</h3>
      </Link>
      <Link to={`/albumView/${song.tag.tags.album}`}>
        <h3 className='link'>{song.tag.tags.album}</h3>
      </Link>
      <h3>{song.duration}</h3>
    </div>
  )
}

export default SongListItem
