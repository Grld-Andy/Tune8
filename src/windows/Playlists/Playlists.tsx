import React, { useContext, useState } from 'react'
import './style.css'
import SongTile from '../../components/SongTile/SongTile'
// import MusicNavigation from '../../components/MusicNavigation/MusicNavigation'
import { SortedPlaylists, SortedSongs } from '../../data'
import { PlaylistContext } from '../../contexts/PlaylistsContext'
import { placeholderSongImages } from '../../assets'
import { PlaylistFormContext } from '../../contexts/PlaylistFormContext'

const Playlists: React.FC = () => {
  const [showNav, setShowNav] = useState(false)
  const toggleShowNav: () => void = () => {
    setShowNav(!showNav)
  }
  // const closeAndScroll: () => void = () => {
  //   setShowNav(false)
  // }

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

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Playlists</h1>
        </div>
        <div className="nav-right">
          <button onClick={createPlaylist}>Create New</button>
          <button>Sort by</button>
          <button>Add Files</button>
        </div>
      </nav>
      {
        playlists.length > 0?
        <div className="albums view">
            {/* {
              showNav &&
              <MusicNavigation toggleShowNav={toggleShowNav} object={Allplaylists} closeAndScroll={closeAndScroll}/>
            } */}
            {
              Object.keys(Allplaylists).sort().map(letter => (
                <section key={letter} id={letter}>
                  <h2 onClick={toggleShowNav}>{letter}</h2>
                  <div className="cards">
                    {
                      Array.from(Allplaylists[letter]).map((playlist, index) => {
                        const newEmpty = {
                          tag: {tags: {title: '',artist: '',album: '',year: 0}},
                          imageSrc: playlist.defaultImage ? playlist.defaultImage : placeholderSongImages[Math.floor(Math.random() * 4)],
                          duration: '', isFavorite: false, src: ''
                        }
                        return(
                        <SongTile
                          song={playlist.songs.length > 0 ? playlist.songs[0] : newEmpty}
                          key={index}
                          page={'playlist'}
                          playlistName={playlist.name}
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
          <button>Add +</button>
        </div>
      </div>
      }
      
    </>
  )
}

export default Playlists
