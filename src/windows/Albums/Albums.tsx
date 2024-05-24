import React, { useState } from 'react'
import './style.css'
import { songs } from '../../assets'
import SongTile from '../../components/SongTile/SongTile'
import { SortedSongs } from '../../data'
import { alphabets } from '../../constants'

const Albums: React.FC = () => {
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
              <div className="songs-nav" onClick={toggleShowNav}>
                {
                  alphabets.map(letter => (
                    albums[letter] && albums[letter].size > 0 ?
                    <a key={letter} href={`#${letter}`} className='open' onClick={closeAndScroll}>{letter}</a> :
                    <a key={letter} className='closed'>{letter}</a> 
                  ))
                }
              </div>
            }
            {
              Object.keys(albums).sort().map(letter => (
                <section key={letter} id={letter}>
                  <h2 onClick={toggleShowNav}>{letter}</h2>
                  <div className="cards">
                    {
                      Array.from(albums[letter]).map(song => (
                        <SongTile
                          key={song.tag.tags.title}
                          song={song}
                          page={'albums'}
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
