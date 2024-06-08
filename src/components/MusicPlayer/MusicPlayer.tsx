import React, { useContext, useEffect, useRef, useState } from 'react'
import {FaCirclePause, FaVolumeOff, FaCirclePlay, FaShuffle, FaForward, FaBackward, FaVolumeHigh} from 'react-icons/fa6'
import {ImEnlarge} from 'react-icons/im'
import {TbRepeat, TbRepeatOnce, TbRepeatOff} from 'react-icons/tb'
import {HiMiniWindow, HiMiniEllipsisHorizontal} from 'react-icons/hi2'
import {MdFavoriteBorder, MdFavorite} from 'react-icons/md'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import FavoritesContext from '../../contexts/FavoritesContext'
import { DurationToString, shuffleArray } from '../../constants'
import { Link } from 'react-router-dom'
import './style.css'

interface Props{
  displayLyrics: () => void,
  showLyrics: boolean
}

const MusicPlayer: React.FC<Props> = ({displayLyrics, showLyrics}) => {
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

  // currentsong logic(next, prev, shuffle, play/pause)
  const {currentSong, currentSongDispatch} = useContext(CurrentSongContext)
  const {queue} = useContext(QueueSongsContext)
  const nextSong: () => void = () => {
    let currentSongIndex: number = currentSong.index
    if(currentSongIndex === queue.length-1){
      currentSongIndex = -1
    }
    if (currentSong.audioRef) currentSong.audioRef.currentTime = 0
    currentSongDispatch({
      type: 'SET_CURRENT_SONG', payload: queue[currentSongIndex + 1], isPlaying: currentSong.isPlaying,
      index: currentSongIndex + 1, audioRef: new Audio(queue[currentSongIndex + 1].src)
    })
  }
  const prevSong: () => void = () => {
    let currentSongIndex: number = currentSong.index
    if(currentSongIndex === 0){
      currentSongIndex = queue.length
    }
    if (currentSong.audioRef) currentSong.audioRef.currentTime = 0
    currentSongDispatch({
      type: 'SET_CURRENT_SONG', payload: queue[currentSongIndex - 1], isPlaying: currentSong.isPlaying,
      index: currentSongIndex - 1, audioRef: new Audio(queue[currentSongIndex - 1].src)
    })
  }
  const {dispatch} = useContext(QueueSongsContext)
  const shuffleSongs: () => void = () => {
    const newQueue = shuffleArray(queue)
    currentSongDispatch({
      type: 'SET_CURRENT_SONG', payload: newQueue[0],
      index: 0, audioRef: new Audio(queue[0].src)
    })
    dispatch({type: 'SET_QUEUE', payload: newQueue, index: 0})
  }
  const togglePlay: (val: boolean) => void = (val: boolean) => {
    currentSongDispatch({type: 'TOGGLE_CURRENT_SONG_STATE', payload: null, index: 0, isPlaying: val})
  }
  
  // favorites logic
  const {favorites, favoritesDispatch} = useContext(FavoritesContext)
  const [isFavorite, setIsFavorite] = useState(favorites.some(favSong => favSong.tag.tags.title === currentSong.song?.tag.tags.title))
  const toggleFavorite: () => void = () => {
    if(currentSong.song){
      if(!favorites.some(favSong => favSong.tag.tags.title === currentSong.song?.tag.tags.title)){
        setIsFavorite(true)
        favoritesDispatch({type: 'ADD_TO_FAVORITES', payload: [currentSong.song]})
      }else{
        setIsFavorite(false)
        favoritesDispatch({type: 'REMOVE_FROM_FAVORITES', payload: [currentSong.song]})
      }
      currentSongDispatch({type: 'TOGGLE_FAVORITE', payload: null, index: currentSong.index})
    }
  }
  useEffect(() => {
    setIsFavorite(favorites.some(favSong => favSong.tag.tags.title === currentSong.song?.tag.tags.title))
  }, [currentSong, favorites])
  useEffect(() => {
      if (currentSong.isPlaying)
        currentSong.audioRef?.play()
      else
        currentSong.audioRef?.pause()
  }, [currentSong])

  // reset time played if no song playing
  useEffect(() => {
    if(!currentSong.song){
      setTimePlayed('00:00')
      setSongProgress(0)
    }
  }, [currentSong])

  // progress bar logic
  const [songProgress, setSongProgress] = useState<number>(0)
  const [timePlayed, setTimePlayed] = useState<string>('00:00')
  const intervalRef = useRef<number | null>(null)
  const handleSongProgress = () => {
    if(intervalRef.current){
      clearInterval(intervalRef.current)
    }
    intervalRef.current = window.setInterval(() => {
      if (currentSong.audioRef) {
        setSongProgress(currentSong.audioRef.currentTime / currentSong.audioRef.duration * 100)
        setTimePlayed(DurationToString(currentSong.audioRef.currentTime))
        if (currentSong.song) {
          if (currentSong.audioRef.currentTime === currentSong.audioRef.duration) {
            if (repeat === 'repeat-all')
              nextSong()
            else if (repeat === 'no-repeat' && currentSong.index === queue.length - 1) {
              currentSong.audioRef.pause()
              togglePlay(false)
            }
            else if (repeat === 'repeat-one') {
              currentSong.audioRef.currentTime = 0
              currentSong.audioRef.play()
            } else {
              nextSong()
            }
          }
        }
      }
    }, 250)
  }

  useEffect(() => {
    if(currentSong.song)
      handleSongProgress()
  }, [currentSong, queue])

  // progress bar click logic
  const progressRef = useRef<HTMLDivElement|null>(null)
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (progressRef.current && currentSong.audioRef) {
      const width = progressRef.current.clientWidth
      const offset = e.nativeEvent.offsetX
      const divprogress = (offset / width) * 100
      currentSong.audioRef.currentTime = (divprogress / 100) * currentSong.audioRef.duration
    }
  }

  // handle lyrics
  const toggleLyricsView = () => {
    displayLyrics()
  }

  // minimize
  const minimize = () => {
    window.ipcRenderer.Minimize()
  }
  // maximize
  const maximize = () => {
    window.ipcRenderer.Maximize()
  }

  // options
  const [showOptions, setShowOptions] = useState<string>('')
  const handleShowOptions = (val: string) => {
    setShowOptions(val)
  }

  // playback speed
  const handlePlaybackSpeed = (speed: number) => {
    if(!currentSong.audioRef)return
    if(speed === 1){
      currentSong.audioRef.playbackRate = 1
      handleShowOptions('')
    }
    else if(speed < 0){
      currentSong.audioRef.playbackRate *= Math.abs(speed)
    }
    else{
      currentSong.audioRef.playbackRate += speed
      handleShowOptions('')
    }
    sessionStorage.setItem('playbackSpeed', currentSong.audioRef.playbackRate.toString())
  }

  // song volume
  const [mute, setMute] = useState<boolean>(false)
  const handleMuteSong = (val: boolean) => {
    if(currentSong.audioRef){
      currentSong.audioRef.muted = val
      setMute(val)
    }
  }

  return (
    <div className='musicPlayer'>
      <audio src={currentSong.song?.src} ref={el => { currentSong.audioRef = el }}></audio>
      <div className="top">
        <div>
          <h5>{timePlayed}</h5>
        </div>
        <div className="custom_progress" onClick={handleProgressClick} ref={progressRef}>
          {
            currentSong.audioRef ?
            <div className="progress_bar" style={{width: `${songProgress}%`}}>
                <div className="progress_thumb"></div>
            </div>:
            <div className="progress_bar" style={{width: '0%'}}>
              <div className="progress_thumb"></div>
            </div>
          }
        </div>
        <div>
          {
            currentSong.song && currentSong.audioRef ?
            <h5>{DurationToString(currentSong.audioRef?.duration)}</h5> :
            <h5>00:00</h5>
          }
        </div>
      </div>
      <div className="bottom">
        <div className={`b-left lyrics-${showLyrics}`} onClick={toggleLyricsView}>
          {
            currentSong.song?
            <img src={currentSong.song.imageSrc} alt=''/>:
            <img src='/placeholders/music1.jpg' alt=''/>
          }
          <div className="text">
            {
              currentSong.song?
              <>
                <h5>{currentSong.song.tag.tags.title}</h5>
                <h5>{currentSong.song.tag.tags.artist}</h5>
              </>:
              <>
                <h5>Play a song</h5>
                <h5>Click one now</h5>
              </>
            }
          </div>
        </div>
        {/* <div className='b-space'></div> */}
        <div className={currentSong.song ? 'b-center' : 'b-center locked'}>
          <FaShuffle className='icon shuffle_icon' onClick={shuffleSongs}/>
          {
            repeat === 'repeat-all'?
            <TbRepeat className='icon repeat_icon' onClick={handleSongRepeatCycle}/>:
            repeat === 'repeat-one'?
            <TbRepeatOnce className='icon repeat_icon' onClick={handleSongRepeatCycle}/>:
            <TbRepeatOff className='icon repeat_icon' onClick={handleSongRepeatCycle}/>
          }
          <FaBackward className='icon prev_icon' onClick={prevSong}/>
          {
            currentSong.isPlaying?
            <FaCirclePause className='icon pause_icon' size={40} onClick={() => {togglePlay(false)}}/>:
            <FaCirclePlay className='icon play_icon' size={40} onClick={() => {togglePlay(true)}}/>
          }
          <FaForward className='icon next_icon' onClick={nextSong}/>
          <HiMiniWindow className='icon mini_icon' onClick={minimize}/>
          {
            isFavorite ?
            <MdFavorite className='icon fav_icon' onClick={toggleFavorite}/>:
            <MdFavoriteBorder className='icon fav_icon' onClick={toggleFavorite}/>
          }
        </div>
        <div  className={currentSong.song ? 'b-right' : 'b-right locked'}>
          {
            mute ?
            <FaVolumeOff className='icon' onClick={() => {handleMuteSong(false)}}/>:
            <FaVolumeHigh className='icon' onClick={() => {handleMuteSong(true)}}/>
          }
          <ImEnlarge className='icon enlarge_icon' onClick={maximize}/>
          <HiMiniEllipsisHorizontal className='icon' onClick={() => {handleShowOptions('options')}}/>
          {
            showOptions === 'options' &&
            <ul className="b-right-menu">
              <li  onClick={() => {handleShowOptions('details')}}
              className='first'>Details</li>
              <li onClick={() => {handleShowOptions('')}}>
                <Link to={`albumView/${currentSong.song?.tag.tags.album}`}>
                  View Album
                </Link>
              </li>
              <li onClick={() => {handleShowOptions('')}}>
                <Link to={`artistView/${currentSong.song?.tag.tags.artist}`}>
                  View Artist
                </Link>
              </li>
              <li className='sub'>Playback Speed
                <div className="sub-menu">
                  <li onClick={() => {handlePlaybackSpeed(-0.5)}}>Slower (1/2)</li>
                  <li onClick={() => {handlePlaybackSpeed(-0.25)}}>Slow (1/4)</li>
                  <li onClick={() => {handlePlaybackSpeed(1)}}>Nomal (x 1)</li>
                  <li onClick={() => {handlePlaybackSpeed(0.25)}}>Fast (+ 0.25)</li>
                  <li onClick={() => {handlePlaybackSpeed(0.5)}}>Faster (+ 0.5)</li>
                </div>
              </li>
              <li className='last' onClick={() => {handleShowOptions('')}}>
                Mute
              </li>
            </ul>
          }
        </div>
      </div>
      {
        currentSong.song && showOptions &&
        <div className="options-overlay" onClick={() => {handleShowOptions('')}}></div>
      }
      {
        showOptions === 'details' &&
        <div className="song-details">
          <div className="details-container">
            <h1>Song details</h1>
            <div className="main-info">
              <div className="tile">
                <h3>Title</h3>
                <h4>{currentSong.song?.tag.tags.title}</h4>
              </div>
              <div className="tile">
                <h3>Album</h3>
                <h4>{currentSong.song?.tag.tags.album}</h4>
              </div>
              <div className="tile">
                <h3>Artist</h3>
                <h4>{currentSong.song?.tag.tags.artist}</h4>
              </div>
              <div className="tile">
                <h3>Year Released</h3>
                <h4>{currentSong.song?.tag.tags.year}</h4>
              </div>
              <div className="tile">
                <h3>Song Duration</h3>
                <h4>{currentSong.song?.duration}</h4>
              </div>
            </div>
            <div className="source">
              <h2>{currentSong.song?.src}</h2>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default MusicPlayer
