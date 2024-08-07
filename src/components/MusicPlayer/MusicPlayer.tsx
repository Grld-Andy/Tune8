import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import {FaCirclePause, FaVolumeOff, FaCirclePlay, FaShuffle, FaForward, FaBackward, FaVolumeHigh} from 'react-icons/fa6'
import {VscScreenFull} from 'react-icons/vsc'
import { TbRepeat, TbRepeatOnce, TbRepeatOff } from 'react-icons/tb'
import {HiMiniWindow, HiMiniEllipsisHorizontal} from 'react-icons/hi2'
import {MdFavoriteBorder, MdFavorite} from 'react-icons/md'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import FavoritesContext from '../../contexts/FavoritesContext'
import { DurationToString, shuffleArray, updateCurrentSongInDatabase } from '../../utilities'
import { Link } from 'react-router-dom'
import './style.css'
import { SongFormContext } from '../../contexts/SongFormContext'

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
  const nextSong: () => void = useCallback(() => {
    let currentSongIndex: number = currentSong.index
    if(currentSongIndex === queue.length-1){
      currentSongIndex = -1
    }
    if (currentSong.audioRef){ currentSong.audioRef.currentTime = 0}
    const nextsong = queue[currentSongIndex + 1]
    currentSongDispatch({
      type: 'SET_CURRENT_SONG', payload: nextsong, isPlaying: currentSong.isPlaying,
      index: currentSongIndex + 1, audioRef: new Audio(nextsong.src)
    })
    updateCurrentSongInDatabase(nextsong, currentSongIndex)
  }, [currentSong, currentSongDispatch, queue])
  const prevSong: () => void = useCallback(() => {
    let currentSongIndex: number = currentSong.index
    if(currentSongIndex === 0){
      currentSongIndex = queue.length
    }
    if (currentSong.audioRef) {currentSong.audioRef.currentTime = 0}
    const prevsong = queue[currentSongIndex - 1]
    currentSongDispatch({
      type: 'SET_CURRENT_SONG', payload: prevsong, isPlaying: currentSong.isPlaying,
      index: currentSongIndex - 1, audioRef: new Audio(prevsong.src)
    })
    updateCurrentSongInDatabase(prevsong, currentSongIndex)
  }, [currentSong.audioRef, currentSong.index, currentSong.isPlaying, currentSongDispatch, queue])
  const {dispatch} = useContext(QueueSongsContext)
  const shuffleSongs: () => void = () => {
    const newQueue = shuffleArray(queue)
    currentSongDispatch({
      type: 'SET_CURRENT_SONG', payload: newQueue[0],
      index: 0, audioRef: new Audio(queue[0].src)
    })
    updateCurrentSongInDatabase(newQueue[0], 0)
    dispatch({type: 'SET_QUEUE', payload: newQueue, index: 0})
  }
  const togglePlay: (val: boolean) => void = (val: boolean) => {
    currentSongDispatch({type: 'TOGGLE_CURRENT_SONG_STATE', payload: null, index: 0, isPlaying: val})
  }
  
  // favorites logic
  const {favorites, favoritesDispatch} = useContext(FavoritesContext)
  const [isFavorite, setIsFavorite] = useState(favorites.some(favSong => favSong.tag.tags.title === currentSong.song?.tag.tags.title))
  const toggleFavorite: () => void = async() => {
    if(currentSong.song){
      if(!favorites.some(favSong => favSong.tag.tags.title === currentSong.song?.tag.tags.title)){
        setIsFavorite(true)
        await window.ipcRenderer.updateSongDatabase({...currentSong.song, isFavorite: true})
        favoritesDispatch({type: 'ADD_TO_FAVORITES', payload: [currentSong.song]})
      }else{
        setIsFavorite(false)
        await window.ipcRenderer.updateSongDatabase({...currentSong.song, isFavorite: false})
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
        if(currentSong.audioRef.paused){
          togglePlay(false)
        }else{
          togglePlay(true)
        }
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

  // listening to shortcuts
  useEffect(() => {
    window.ipcRenderer.on('media-control', (_event, command) => {
      switch (command) {
        case 'next':
          console.log('next song')
          nextSong()
          break
        case 'previous':
          console.log('prev song')
          prevSong()
          break
        default:
          console.error(`Unknown media control command: ${command}`)
      }
    })
  }, [nextSong, prevSong])
  

  // useEffect(() => {
  //   window.addEventListener('keypress', (e: KeyboardEvent) => {
  //     console.log(e.key)
  //     switch(e.key){
  //       case 'MediaTrackNext':
  //         console.log('next song')
  //         nextSong()
  //         break
  //       case 'MediaTrackPrevious':
  //         console.log('prev song')
  //         prevSong()
  //         break
  //       default:
  //         break
  //     }
  //   })
  // }, [nextSong, prevSong])
  

  useEffect(() => {
    if(currentSong.song)
      handleSongProgress()
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // handleShowOptions('')
    }
    else if(speed < 0){
      currentSong.audioRef.playbackRate *= Math.abs(speed)
    }
    else{
      currentSong.audioRef.playbackRate += speed
      // handleShowOptions('')
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

  // song details
  const {songFormDispatch} = useContext(SongFormContext)
  const showDetails = () => {
    if(currentSong.song){
      handleShowOptions('')
      songFormDispatch({type: 'OPEN_DETAILS', payload: currentSong.song})
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
            <img src='placeholders/music1.jpg' alt=''/>
          }
          <div className="text">
            {
              currentSong.song && currentSong.song.tag?
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
          <VscScreenFull className='icon enlarge_icon' onClick={maximize}/>
          <HiMiniEllipsisHorizontal className='icon details' onClick={() => {handleShowOptions('options')}}/>
          {
            showOptions === 'options' &&
            <ul className="b-right-menu">
              <li  onClick={showDetails}
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
              <li className='last' onClick={() => {handleMuteSong(!mute)}}>
                {
                  mute ? "Unmute" : "Mute"
                }
              </li>
            </ul>
          }
        </div>
      </div>
      {
        currentSong.song && showOptions &&
        <div className="options-overlay" onClick={() => {handleShowOptions('')}}></div>
      }
    </div>
  )
}

export default MusicPlayer
