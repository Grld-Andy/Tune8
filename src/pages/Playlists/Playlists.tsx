import React, { useContext, useState } from 'react'
import './style.css'
import SongTile from '../../components/SongTile/SongTile'
import { PlaylistInterface, Song, SortedPlaylists, SortedSongs } from '../../data'
import { PlaylistContext } from '../../contexts/PlaylistsContext'
import { placeholderSongImages } from '../../assets'
import { PlaylistFormContext } from '../../contexts/PlaylistFormContext'
import { v1 } from 'uuid'
import Buttons from '../../components/Buttons/Buttons'
import AddMusicFolderButton from '../../components/Buttons/AddMusicFolder/AddMusicFolder'

const Playlists: React.FC = () => {
  const [showNav, setShowNav] = useState(false)
  const toggleShowNav: () => void = () => {
    setShowNav(!showNav)
  }

  const {playlists} = useContext(PlaylistContext)
  
  const Allplaylists: SortedPlaylists = {}
  const sortedSongs: SortedSongs = {}

  playlists.forEach(playlist => {
    let firstLetter:string = playlist.name.charAt(0).toUpperCase()
    firstLetter = /^[A-Za-z]$/.test(firstLetter) ? firstLetter : '#'
    // initialize to store empty array before pushing
    if (!Allplaylists[firstLetter]) {
      Allplaylists[firstLetter] = new Set()
      sortedSongs[firstLetter] = new Set()
    }
    Allplaylists[firstLetter].add(playlist)
  })

  // create playlist
  const {playlistFormDispatch} = useContext(PlaylistFormContext)
  const createPlaylist = () => {
    playlistFormDispatch({type: 'OPEN_FORM', payload: 'create'})
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
    const selectedPlaylists: Array<PlaylistInterface> = selected.flatMap(playlistName => {
      return playlists.filter(item => item.name === playlistName)
    })
    return selectedPlaylists.flatMap(playlist => playlist.songs)
  }

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Playlists</h1>
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
              <button onClick={createPlaylist}>Create New</button>
              <AddMusicFolderButton/>
            </>
          }
        </div>
      </nav>
      {
        playlists.length > 0?
        <div className="albums view">
            {
              Object.keys(Allplaylists).sort().map(letter => (
                <section key={letter} id={letter}>
                  <h2 onClick={toggleShowNav}>{letter}</h2>
                  <div className="cards">
                    {
                      Array.from(Allplaylists[letter]).map((playlist, index) => {
                        const newEmpty = {
                          id: v1(),
                          tag: {tags: {title: '',artist: '',album: '',year: 0, genre: ''}},
                          imageSrc: playlist.defaultImage ? playlist.defaultImage : placeholderSongImages[Math.floor(Math.random() * 4)],
                          duration: '', isFavorite: false, src: '', dateAdded: new Date()
                        }
                        return(
                          <SongTile
                            song={(playlist.songs && playlist.songs.length > 0) ? playlist.songs[0] : newEmpty}
                            key={index}
                            page={'playlist'}
                            playlistName={playlist.name}
                            addToSelected={addToSelected}
                            selected={selected}
                            removeFromSelected={removeFromSelected}
                          />
                      )})
                    }
                  </div>
                </section>
              ))
            }
      </div>:
      <div className="empty-window view">
        <div className="cell">
          <h1>No playlist here</h1>
          <button onClick={createPlaylist}>Add +</button>
        </div>
      </div>
      }
      
    </>
  )
}

export default Playlists
