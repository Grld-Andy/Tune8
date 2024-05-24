import React, { useState } from 'react'
import './style.css'
import { songs } from '../../assets'
import SongTile from '../../components/SongTile/SongTile'
import { SortedSongs } from '../../data'
import { alphabets } from '../../constants'

const Artists: React.FC = () => {
  const [showNav, setShowNav] = useState(false)
  const toggleShowNav: () => void = () => {
    setShowNav(!showNav)
  }
  const closeAndScroll: () => void = () => {
    setShowNav(false)
  }

  const artists: SortedSongs = {}

  songs.forEach(song => {
    let firstLetter:string = song.tag.tags.artist.charAt(0).toUpperCase()
    firstLetter = /^[A-Za-z]$/.test(firstLetter) ? firstLetter : '#'
    // initialize to store empty array before pushing
    if (!artists[firstLetter]) {
      artists[firstLetter] = new Set()
    }
    if(!Array.from(artists[firstLetter]).some(elem => elem.tag.tags.artist === song.tag.tags.artist)){
      artists[firstLetter].add(song)
    }
  })

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Artists</h1>
        </div>
        <div className="nav-right">
          <button>Sort by</button>
          <button>Add Files</button>
        </div>
      </nav> 
      <div className="artists view">
            {
              showNav &&
              <div className="songs-nav" onClick={toggleShowNav}>
                {
                  alphabets.map(letter => (
                    artists[letter] && artists[letter].size > 0 ?
                    <a key={`nav-${letter}`} href={`#${letter}`} className='open' onClick={closeAndScroll}>{letter}</a> :
                    <a key={`nav-${letter}`} className='closed'>{letter}</a> 
                  ))
                }
              </div>
            }
            {
              Object.keys(artists).sort().map(letter => (
                <section key={letter} id={letter}>
                  <h2 onClick={toggleShowNav}>{letter}</h2>
                  <div className="cards">
                    {
                      Array.from(artists[letter]).map(song => (
                        <SongTile
                          key={song.tag.tags.title}
                          song={song}
                          page={'artists'}
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

export default Artists
