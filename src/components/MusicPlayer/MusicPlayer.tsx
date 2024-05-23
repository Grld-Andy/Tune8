import React from 'react'
import {FaRotate, FaCirclePause, FaCirclePlay, FaShuffle, FaForward, FaBackward} from 'react-icons/fa6'
import {ImEnlarge} from 'react-icons/im'
import {HiMiniWindow, HiMiniEllipsisHorizontal} from 'react-icons/hi2'
import {MdFavoriteBorder, MdFavorite} from 'react-icons/md'
import './style.css'
import { music3 } from '../../assets'

const MusicPlayer: React.FC = () => {
  return (
    <div className='musicPlayer'>
      <div className="top">
        <h5>00:00</h5>
        <progress></progress>
        <h5>03:10</h5>
      </div>
      <div className="bottom">
        <div className="b-left">
          <img src={music3} alt=''/>
          <div className="text">
            <h5>Title</h5>
            <h5>Artist</h5>
          </div>
        </div>
        <div className="b-center">
          <FaShuffle className='icon'/>
          <FaRotate className='icon'/>
          <FaBackward className='icon'/>
          <FaCirclePlay className='icon' size={40}/>
          <FaForward className='icon'/>
          <HiMiniWindow className='icon'/>
          <MdFavoriteBorder className='icon'/>
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
