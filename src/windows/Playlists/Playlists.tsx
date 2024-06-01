import React, { useState } from 'react'
import './style.css'
import { PlaylistInterface, playlists } from '../../assets'
import SongTile from '../../components/SongTile/SongTile'
// import MusicNavigation from '../../components/MusicNavigation/MusicNavigation'
import { SortedSongs } from '../../data'

const Playlists: React.FC = () => {
  const [showNav, setShowNav] = useState(false)
  const toggleShowNav: () => void = () => {
    setShowNav(!showNav)
  }
  // const closeAndScroll: () => void = () => {
  //   setShowNav(false)
  // }

  interface SortedPlaylists {
    [key: string]: Set<PlaylistInterface>
}
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

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Playlists</h1>
        </div>
        <div className="nav-right">
          <button>Create New</button>
          <button>Sort by</button>
          <button>Add Files</button>
        </div>
      </nav> 
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
                      Array.from(Allplaylists[letter]).map(playlist => (
                        <SongTile
                          song={playlist.songs[0]}
                          key={playlist.songs[0].tag.tags.title}
                          page={'playlist'}
                          playlistName={playlist.name}
                        />
                      ))
                    }
                  </div>
                </section>
              ))
            }
      </div>
    </>
  )
}

export default Playlists
