import React, { useContext, useEffect, useState } from 'react'
import {FaCirclePause, FaCirclePlay, FaShuffle, FaForward, FaBackward} from 'react-icons/fa6'
import {ImEnlarge} from 'react-icons/im'
import {TbRepeat, TbRepeatOnce, TbRepeatOff} from 'react-icons/tb'
import {HiMiniWindow, HiMiniEllipsisHorizontal} from 'react-icons/hi2'
import {MdFavoriteBorder, MdFavorite} from 'react-icons/md'
import { song1 } from '../../assets'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import './style.css'
import FavoritesContext from '../../contexts/FavoritesContext'

const MusicPlayer: React.FC = () => {
  // repeat logic
  const repeatTypes: Array<string> = ['repeat-all', 'no-repeat', 'repeat-one']
  const [repeat, setRepeat] = useState(localStorage.getItem('repeatType') ? localStorage.getItem('repeatType') : repeatTypes[0])
  const handleSongRepeatCycle: () => void = () => {
    let repeatIndex = repeatTypes.findIndex(temp => temp === repeat)
    if(repeatIndex === repeatTypes.length - 1){
      repeatIndex = -1
    }
    setRepeat(repeatTypes[repeatIndex + 1])
    localStorage.setItem('repeatType', repeatTypes[repeatIndex + 1])
  }

  // currentsong logic(next, prev, play/pause)
  const {currentSong, currentSongDispatch} = useContext(CurrentSongContext)
  const {queue} = useContext(QueueSongsContext)
  const nextSong: () => void = () => {
    let currentSongIndex: number = queue.findIndex(song => song.tag.tags.title === currentSong?.tag.tags.title)
    if(currentSongIndex === queue.length-1){
      currentSongIndex = -1
    }
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: queue[currentSongIndex + 1]})
  }
  const prevSong: () => void = () => {
    let currentSongIndex: number = queue.findIndex(song => song.tag.tags.title === currentSong?.tag.tags.title)
    if(currentSongIndex === 0){
      currentSongIndex = queue.length
    }
    currentSongDispatch({type: 'SET_CURRENT_SONG', payload: queue[currentSongIndex - 1]})
  }
  const [isPlaying, setIsPlaying] = useState(false)
  const togglePlay: () => void = () => {
    setIsPlaying(!isPlaying)
  }
  
  const {favorites, favoritesDispatch} = useContext(FavoritesContext)
  const [isFavorite, setIsFavorite] = useState(favorites.some(favSong => favSong.tag.tags.title === currentSong?.tag.tags.title))
  const toggleFavorite: () => void = () => {
    if(currentSong){
      if(!favorites.some(favSong => favSong.tag.tags.title === currentSong?.tag.tags.title)){
        setIsFavorite(true)
        favoritesDispatch({type: 'ADD_TO_FAVORITES', payload: [currentSong]})
      }else{
        setIsFavorite(false)
        favoritesDispatch({type: 'REMOVE_FROM_FAVORITES', payload: [currentSong]})
      }
      currentSongDispatch({type: 'TOGGLE_FAVORITE', payload: null})
    }
  }
  useEffect(() => {
    setIsFavorite(favorites.some(favSong => favSong.tag.tags.title === currentSong?.tag.tags.title))
  }, [currentSong, favorites])

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
        <div className={currentSong ? 'b-center' : 'b-center locked'}>
          <FaShuffle className='icon'/>
          {
            repeat === 'repeat-all'?
            <TbRepeat className='icon' onClick={handleSongRepeatCycle}/>:
            repeat === 'repeat-one'?
            <TbRepeatOnce className='icon' onClick={handleSongRepeatCycle}/>:
            <TbRepeatOff className='icon' onClick={handleSongRepeatCycle}/>
          }
          <FaBackward className='icon' onClick={prevSong}/>
          {
            isPlaying?
            <FaCirclePause className='icon' size={40} onClick={togglePlay}/>:
            <FaCirclePlay className='icon' size={40} onClick={togglePlay}/>
          }
          <FaForward className='icon' onClick={nextSong}/>
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
