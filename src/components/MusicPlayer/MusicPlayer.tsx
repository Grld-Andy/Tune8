import React from 'react'
import {FaRotate, FaCirclePause, FaCirclePlay, FaShuffle, FaForward, FaBackward} from 'react-icons/fa6'
import {ImEnlarge} from 'react-icons/im'
import {HiMiniWindow, HiMiniEllipsisHorizontal} from 'react-icons/hi2'
import {MdFavoriteBorder, MdFavorite} from 'react-icons/md'
import './style.css'
import { song1 } from '../../assets'

const MusicPlayer: React.FC = () => {
  const [isFavorite, setIsFavorite] = React.useState(false)
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }
  const [isPlaying, setIsPlaying] = React.useState(false)
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className='musicPlayer'>
      <div className="top">
        <h5>00:00</h5>
        <progress value={75} max={100}></progress>
        <h5>{song1.duration}</h5>
      </div>
      <div className="bottom">
        <div className="b-left">
          <img src={song1.imageSrc} alt=''/>
          <div className="text">
            <h5>{song1.tag.tags.title}</h5>
            <h5>{song1.tag.tags.artist}</h5>
          </div>
        </div>
        <div className="b-center">
          <FaShuffle className='icon'/>
          <FaRotate className='icon'/>
          <FaBackward className='icon'/>
          {
            isPlaying?
            <FaCirclePause className='icon' size={40} onClick={togglePlay}/>:
            <FaCirclePlay className='icon' size={40} onClick={togglePlay}/>
          }
          <FaForward className='icon'/>
          <HiMiniWindow className='icon'/>
          {
            isFavorite ?
            <MdFavorite className='icon' onClick={toggleFavorite}/>:
            <MdFavoriteBorder className='icon' onClick={toggleFavorite}/>
          }
        </div>
        <div className="b-right">
          <ImEnlarge className='icon'/>
          <HiMiniEllipsisHorizontal className='icon'/>
        </div>
      </div>
    </div>
  )
}

export default MusicPlayer
