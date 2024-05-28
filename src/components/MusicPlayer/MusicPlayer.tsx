import React, { useContext } from 'react'
import {FaRotate, FaCirclePause, FaCirclePlay, FaShuffle, FaForward, FaBackward} from 'react-icons/fa6'
import {ImEnlarge} from 'react-icons/im'
import {HiMiniWindow, HiMiniEllipsisHorizontal} from 'react-icons/hi2'
import {MdFavoriteBorder, MdFavorite} from 'react-icons/md'
import './style.css'
import { song1 } from '../../assets'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'

const MusicPlayer: React.FC = () => {
  const {currentSong} = useContext(CurrentSongContext)
  
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
        {
          currentSong?
          <h5>{song1.duration}</h5>:
          <h5>00:00</h5>
        }
      </div>
      <div className="bottom">
        <div className="b-left">
          {
            currentSong?
            <img src={currentSong.imageSrc} alt=''/>:
            <img src='/placeholders/music1.jpg' alt=''/>
          }
          <div className="text">
            {
              currentSong?
              <>
                <h5>{currentSong.tag.tags.title}</h5>
                <h5>{currentSong.tag.tags.artist}</h5>
              </>:
              <>
                <h5>Play a song</h5>
                <h5>Click one now</h5>
              </>
              
            }
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
