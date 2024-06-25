import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import "./style.css"
import { AllSongsContext } from '../../contexts/AllSongsContext'
import SongListItem from '../../components/SongListItem/SongListItem'
import { Song } from '../../data'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import { shuffleArray } from '../../utilities'
import Buttons from '../../components/Buttons/Buttons'
import AddTo from '../../components/Buttons/AddTo/AddTo'
import SongTile from '../../components/SongTile/SongTile'
import AddMusicFolderButton from '../../components/Buttons/AddMusicFolder/AddMusicFolder'

const SearchResults: React.FC = () => {
  const {songs} = useContext(AllSongsContext)
  const {query} = useParams<string>()
  
  // get query songs
  const [querySongs, setQuerySongs] = useState<Array<Song>>([])
  const [queryAlbums, setQueryAlbums] = useState<Array<Song>>([])
  const [queryArtists, setQueryArtists] = useState<Array<Song>>([])
  useEffect(() => {
    if(!query)
      return

    const lowerCaseQuery = query.toLowerCase()

    // get songs by title
    const temp1 = songs.filter(song => song.tag.tags.title.toLowerCase().includes(lowerCaseQuery))
    setQuerySongs(temp1)

    // get songs by album
    const albumsSet = new Set(songs.map(song => song.tag.tags.album))
    const filteredAlbums = Array.from(albumsSet).filter(album =>
      album.toLowerCase().includes(lowerCaseQuery)
    )
    const albumResults = filteredAlbums.flatMap(album =>
      songs.filter(song => song.tag.tags.album.toLowerCase().includes(album.toLowerCase()))
    )
    setQueryAlbums(albumResults)

    // get songs by artist
    const artistSet = new Set(songs.map(song => song.tag.tags.album))
    const filteredArtists = Array.from(artistSet).filter(album =>
      album.toLowerCase().includes(lowerCaseQuery)
    )
    const artistResults = filteredArtists.flatMap(album =>
      songs.filter(song => song.tag.tags.album.toLowerCase().includes(album.toLowerCase()))
    )
    setQueryArtists(artistResults)
  }, [query, songs])
  

  const {dispatch} = useContext(QueueSongsContext)
  const {currentSongDispatch} = useContext(CurrentSongContext)
  const setQueueSongs = () => {
    dispatch({type: 'SET_QUEUE', payload: querySongs, index: 0})
  }
  const playAllSongs = () => {
    currentSongDispatch({type: 'SET_CURRENT_SONG', isPlaying: true, payload: querySongs[0], index: 0, audioRef: new Audio(querySongs[0].src), reset: true})
    setQueueSongs()
  }
  const shuffleSongs: () => void = () => {
    const newQueue = shuffleArray(querySongs)
    currentSongDispatch({type: 'SET_CURRENT_SONG', isPlaying: true, payload: newQueue[0], index: 0, audioRef: new Audio(querySongs[0].src), reset: true})
    dispatch({type: 'SET_QUEUE', payload: newQueue, index: 0})
  }

  // mulit select
  const [selected, setSelected] = useState<Array<string>>([])
  const addToSelected = (Group: string) => {
    setSelected([...selected, Group])
  }
  const removeFromSelected = (Group: string) => {
    setSelected(selected.filter(item => item!== Group))
  }
  const clearSelected = () => {
    setSelected([])
  }
  // helper function to get selected songs
  const getSelectedSongs: () => Array<Song> = () => {
    const selectedSongs: Array<Song> = selected.flatMap(songId => {
      return querySongs.filter(item => item.id === songId)
    })
    return selectedSongs
  }

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Results for "{query}"</h1>
        </div>
        <div className="nav-right">
          {
            selected.length > 0 &&
            <Buttons selectedSongs={getSelectedSongs()}
            clearSelected={clearSelected}/>
          }
          {
            selected.length > 0 ||
            <>
              <button className="play" onClick={playAllSongs}>Play</button>
              <button className="shuffle" onClick={shuffleSongs}>Shuffle</button>
              <AddTo selectedSongs={getSelectedSongs()} clearSelected={clearSelected}/>
            </>
          }
        </div>
      </nav>
      <div className="searchResults view">
        {
          queryAlbums.length > 0 &&
          <>
            <h1 className="searchTitles">Albums</h1>
            <div className="searchTiles">
              {
                queryAlbums.slice(0,3).map(album => (
                  <SongTile
                    song={album}
                    key={album.tag.tags.title}
                    page={'album'}
                    addToSelected={addToSelected}
                    selected={selected}
                    removeFromSelected={removeFromSelected}
                  />
                ))
              }
            </div>
          </>
        }
        {
          queryArtists.length > 0 &&
          <>
            <h1 className="searchTitles">Artists</h1>
            <div className="searchTiles">
              {
                queryArtists.slice(0,3).map(artist => (
                  <SongTile
                    song={artist}
                    key={artist.tag.tags.title}
                    page={'artist'}
                    addToSelected={addToSelected}
                    selected={selected}
                    removeFromSelected={removeFromSelected}
                  />
                ))
              }
            </div>
          </>
        }
        {
          querySongs.length > 0 &&
          <>
            <h1 className="searchTitles">Songs</h1>
            <div className="searchItems">
            {
              querySongs.map((song, index) => (
                <SongListItem
                key={index} song={song}
                addToSelected={addToSelected}
                selected={selected}
                removeFromSelected={removeFromSelected}
                setQueueSongs={setQueueSongs}
                index={index}/>
              ))
            }
            </div>
          </>
        }
        {
          querySongs.length === 0 && queryAlbums.length === 0 && queryArtists.length === 0 &&
          <div className="empty-window">
            <div className="cell">
              <h1>No results</h1>
              <AddMusicFolderButton text={'Add +'}/>
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default SearchResults
