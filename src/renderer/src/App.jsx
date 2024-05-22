import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import React from 'react'

import Home from './windows/Home/Home'
import Songs from './windows/Songs/Songs'
import Albums from './windows/Albums/Albums'
import Artists from './windows/Artists/Artists'
import Queue from './windows/Queue/Queue'
import Playlist from './windows/Playlist/Playlist'
import Settings from './windows/Settings/Settings'
import Layout from './Layout';
import Artist from './windows/Artist/Artist';
import ArtistView from './windows/ArtistView/ArtistView';
import Album from './windows/Album/Album';
import AlbumView from './windows/AlbumView/AlbumView';
import Favorites from './windows/Favorites/Favorites';
import ScrollToTop from './components/ScrollToTop';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioElem = useRef()
  const [musicProgress, setMusicProgress] = useState(0)
  const [allSongs, setAllSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [queueSongs, setQueueSongs] = useState([])
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?  localStorage.getItem("theme") : 'light')
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [favoriteSongs, setFavoriteSongs] = useState([])
  const [lastSongs, setLastSongs] = useState([])
  const [recentSongs, setRecentSongs] = useState([])
  const [contextMenuVisible, setContextMenuVisible] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [clickedSong, setClickedSong] = useState(null)
  const [currentWindow, setCurrentWindow] = useState("Home")
  
  // context menu
  const handleContextMenu = (event, song, window) => {
    event.preventDefault()
    setClickedSong(song)
    setCurrentWindow(window)
    setContextMenuPosition({ x: event.clientX, y: event.clientY })
    setContextMenuVisible(true)
  }

  function insertSongAfterCurrent(){
    let index = 0
    if(currentSong){
      index = currentIndex
    }
    setQueueSongs(prevQueue => {
      const newQueue = [...prevQueue]
      newQueue.splice(index, 0, clickedSong)
      return newQueue
    })
    setTimeout(async () => {
      saveQueueSongs()
    }, 3)
  }
  const handleMenuItemClick = (menuItem) => {
      switch (menuItem){
        case 'Play':
          if(currentWindow === 'Favorites'){
            PlayPause(clickedSong, favoriteSongs, true)
          }
          if(currentWindow === 'Songs'){
            PlayPause(clickedSong, [clickedSong], true)
          }
          break
        case 'PlayNext':
          insertSongAfterCurrent()
          break;
        case 'AddToQueue':
          setQueueSongs(prevQueueSongs => [...prevQueueSongs, clickedSong]);
          setTimeout(async () => {
            saveQueueSongs()
          }, 3)
          break
        case 'RemoveFromQueue':
          setQueueSongs(prevSongs => {
            const newQueue = [...prevSongs]
            const index = queueSongs.findIndex(song => song.id === clickedSong.id)
            newQueue.splice(index, 1)
            return newQueue
          })
          setTimeout(async () => {
            saveQueueSongs()
          }, 3)
          break
        case 'AddToPlaylist':
          break
        case 'RemoveFromFavorite':
          break
        case 'AddToFavorite':
          break
        default:
          console.log("Clear")
      }
      setContextMenuVisible(false);
  }

  useEffect(() => {
    const index = queueSongs.findIndex(song => song === currentSong);
    setCurrentIndex(index);
  }, [currentSong, queueSongs])

  function changeTheme(newTheme){
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  // fetch all songs on app startup
  useEffect(() => {
    fetchItems()
  }, [])

  // setup favorites, last played, recent songs
  useEffect(() => {
    const tempSongs = [...allSongs]
    const favorites = allSongs.filter(song => song.isFavorite === 1)
    setFavoriteSongs(favorites)
    const lastPlayedSongs = tempSongs.filter(song => song.lastPlayed)
    .sort((a, b) => new Date(a["lastPlayed"]) - new Date(b["lastPlayed"]))
    .reverse()
    .slice(0, 21)
    setLastSongs(lastPlayedSongs)
    const recentlyAddedSongs = tempSongs
    .sort((a, b) => new Date(a["dateAdded"]) - new Date(b["dateAdded"]))
    .reverse()
    .slice(0, 21)
    setRecentSongs(recentlyAddedSongs)
  }, [allSongs])

  // change music progress in now playing
  useEffect(() => {
    setInterval(() => {
      if(isPlaying){
        setMusicProgress(audioElem.current.currentTime)
      }
    }, 1000)
  }, [isPlaying])

  // update last played on current song change
  useEffect(() => {
    const saveLastPlayedAsync = async () => {
        try {
            await window.electron.saveLastPlayed(currentSong)
        } catch (error) {
            console.error("Error saving last played:", error)
        }
    }
    saveLastPlayedAsync()
    // setLastSongs(...lastSongs, currentSong)
}, [currentSong])

  // function to fetch all songs
  async function fetchItems(clearAll = false) {
      try {
        await window.electron.createFolders()
        if(clearAll){
          setAllSongs([])
        }
          const directoryContents = await window.electron.getDirectoryContents(clearAll);
          setAllSongs(directoryContents)
          const prevQueue = await window.electron.readQueue()
          if(prevQueue){
            console.log("queue length: ", prevQueue.length)
            if(prevQueue.length > 0){
              setQueueSongs(prevQueue)
            }
          }
      } catch (error) {
          console.error('Error reading directory:', error)
      }
  }

  function prevSong(){
    if (queueSongs.length === 1) {
      // If there is only one song in the queue, reset to the beginning of the song
      audioElem.current.currentTime = 0;
    } else {
      if (currentIndex === 0) {
        setCurrentSong(queueSongs[queueSongs.length - 1]);
      } else {
        setCurrentSong(queueSongs[currentIndex - 1]);
      }
    }
    setTimeout(()=>{
      audioElem.current.play()
      setIsPlaying(true)
    }, 1)
  }

  const nextSong = useCallback(() => {
    const audio = audioElem.current
    if (queueSongs.length === 1) {
      audio.currentTime = 0
    } else {
      const nextIndex = currentIndex === queueSongs.length - 1 ? 0 : currentIndex + 1
      setCurrentIndex(nextIndex)
      setCurrentSong(queueSongs[nextIndex])
    }
    setTimeout(() => {
      audio.play()
      setIsPlaying(true)
    }, 1)
  }, [audioElem, queueSongs, currentIndex, setCurrentIndex, setCurrentSong, setIsPlaying])

  
  // plays next song if current song has ended
  useEffect(() => {
    const audio = audioElem.current;
    const handleEnded = () => {
      nextSong();
    };
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, nextSong])

  async function saveQueueSongs(){
    try {
      const saved = await window.electron.saveQueue(queueSongs);
      if (saved) {
        console.log('Queue saved successfully');
      } else {
        console.log('Queue not saved');
      }
    } catch (error) {
      console.error('Error saving queue:', error);
    }
  }

  function PlayPause(song, queue = allSongs, refreshQueue = true) {
    // keep refreshQueue to prevent re-rendering when a song is clicked on now playing
    if (refreshQueue) {
      if(queueSongs === queue){
        console.log("not refreshing queue")
      }else{
        setQueueSongs(queue)
        setTimeout(async () => {
          saveQueueSongs()
        }, 3)
      }
    }else if(queueSongs.length === 0){
      setQueueSongs(allSongs)
      setTimeout(async () => {
        saveQueueSongs()
      }, 3)
    }
  
      if (currentSong === song) {
        setTimeout(() => {
          if (isPlaying) {
            audioElem.current.pause();
            setIsPlaying(false);
          } else {
            audioElem.current.play();
            setIsPlaying(true);
          }
        }, 1);
      } else {
        setCurrentSong(song);
        setTimeout(() => {
          audioElem.current.play();
          setIsPlaying(true);
        }, 5);
      }
  }

  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Routes>
        <Route path='/' element={<Layout allSongs={allSongs} isPlaying={isPlaying} PlayPause={PlayPause} currentSong={currentSong}
        audioElem={audioElem} musicProgress={musicProgress} setMusicProgress={setMusicProgress}
        nextSong={nextSong} prevSong={prevSong} theme={theme} queueSongs={queueSongs} setAllSongs={setAllSongs}
        currentIndex={currentIndex} favoriteSongs={favoriteSongs} setFavoriteSongs={setFavoriteSongs}
        handleContextMenu={handleContextMenu} handleMenuItemClick={handleMenuItemClick}
        contextMenuVisible={contextMenuVisible} contextMenuPosition={contextMenuPosition}
        setCurrentSong={setCurrentSong}/>}>
          <Route index element={<Home lastSongs={lastSongs} recentSongs={recentSongs} PlayPause={PlayPause}
            currentSong={currentSong} isPlaying={isPlaying}/>}></Route>

          <Route path='albums' element={<Albums allSongs={allSongs}/>}></Route>

          <Route path='songs' element={<Songs allSongs={allSongs} isPlaying={isPlaying}
            currentSong={currentSong} PlayPause={PlayPause}
            handleContextMenu={handleContextMenu} handleMenuItemClick={handleMenuItemClick}
            contextMenuVisible={contextMenuVisible} contextMenuPosition={contextMenuPosition}/>}></Route>

          <Route path='artists' element={<Artists allSongs={allSongs}/>}></Route>

          <Route path='queue' element={<Queue isPlaying={isPlaying}
            handleContextMenu={handleContextMenu} handleMenuItemClick={handleMenuItemClick}
            contextMenuVisible={contextMenuVisible} contextMenuPosition={contextMenuPosition}
            currentSong={currentSong} PlayPause={PlayPause} queueSongs={queueSongs}/>}></Route>

          <Route path='playlist' element={<Playlist isPlaying={isPlaying}
            currentSong={currentSong} PlayPause={PlayPause} queueSongs={queueSongs}/>}></Route>

          <Route path='favorites' element={<Favorites isPlaying={isPlaying}
            currentSong={currentSong} PlayPause={PlayPause} queueSongs={queueSongs}
            handleContextMenu={handleContextMenu} handleMenuItemClick={handleMenuItemClick}
            contextMenuVisible={contextMenuVisible} contextMenuPosition={contextMenuPosition}
            favoriteSongs={favoriteSongs} setFavoriteSongs={setFavoriteSongs}/>}></Route>

          <Route path='settings' element={<Settings changeTheme={changeTheme} fetchItems={fetchItems}/>}></Route>

          <Route path='artist' element={<Artist/>}>
            <Route path=':artist' element={<ArtistView allSongs={allSongs} PlayPause={PlayPause}
            isPlaying={isPlaying} currentSong={currentSong}
            handleContextMenu={handleContextMenu} handleMenuItemClick={handleMenuItemClick}
            contextMenuVisible={contextMenuVisible} contextMenuPosition={contextMenuPosition}/>}></Route>
          </Route>

          <Route path='album' element={<Album/>}>
            <Route path=':album' element={<AlbumView allSongs={allSongs} PlayPause={PlayPause}
            isPlaying={isPlaying} currentSong={currentSong}
            handleContextMenu={handleContextMenu} handleMenuItemClick={handleMenuItemClick}
            contextMenuVisible={contextMenuVisible} contextMenuPosition={contextMenuPosition} />}></Route>
          </Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App