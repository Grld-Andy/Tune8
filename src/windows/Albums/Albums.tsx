import React, { useContext, useState } from 'react'
import './style.css'
import SongTile from '../../components/SongTile/SongTile'
import { SortedSongs } from '../../data'
import MusicNavigation from '../../components/MusicNavigation/MusicNavigation'
import {AllSongsContext} from '../../contexts/AllSongsContext'

const Albums: React.FC = () => {
  const {songs} = useContext(AllSongsContext)

  const [showNav, setShowNav] = useState(false)
  const toggleShowNav: () => void = () => {
    setShowNav(!showNav)
  }
  const closeAndScroll: () => void = () => {
    setShowNav(false)
  }

  const albums: SortedSongs = {}
  songs.forEach(song => {
    let firstLetter:string = song.tag.tags.album.charAt(0).toUpperCase()
    firstLetter = /^[A-Za-z]$/.test(firstLetter) ? firstLetter : '#'
    // initialize to store empty array before pushing
    if (!albums[firstLetter]) {
      albums[firstLetter] = new Set()
    }
    if(!Array.from(albums[firstLetter]).some(elem => elem.tag.tags.album === song.tag.tags.album)){
      albums[firstLetter].add(song)
    }
  })

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Albums</h1>
        </div>
        <div className="nav-right">
          <button>Sort by</button>
          <button>Add Files</button>
        </div>
      </nav> 
      <div className="albums view">
            {
              showNav &&
              <MusicNavigation toggleShowNav={toggleShowNav}
              object={albums} closeAndScroll={closeAndScroll}/>
            }
            {
              Object.keys(albums).sort().map(letter => (
                <section key={letter} id={letter}>
                  <h2 onClick={toggleShowNav}>{letter}</h2>
                  <div className="cards">
                    {
                      Array.from(albums[letter]).sort().map(song => (
                        <SongTile
                          song={song}
                          key={song.tag.tags.title}
                          page={'album'}
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

export default Albums
