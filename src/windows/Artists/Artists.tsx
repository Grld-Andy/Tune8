import React, { useContext, useState } from 'react'
import './style.css'
import SongTile from '../../components/SongTile/SongTile'
import { Song, SortedSongs } from '../../data'
import MusicNavigation from '../../components/MusicNavigation/MusicNavigation'
import { AllSongsContext } from '../../contexts/AllSongsContext'
import Buttons from '../../components/DynamicViews/Buttons/Buttons'

const Artists: React.FC = () => {
  const {songs} = useContext(AllSongsContext)

  const [showNav, setShowNav] = useState(false)
  const toggleShowNav: () => void = () => {
    setShowNav(!showNav)
  }
  const closeAndScroll: () => void = () => {
    setShowNav(false)
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
    const selectedSongs: Array<Song> = selected.flatMap(selectedArtist => {
      return songs.filter(item => item.tag.tags.artist === selectedArtist)
    })
    return selectedSongs
  }

  // get artists
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
          {
            selected.length > 0 &&
            <Buttons selectedSongs={getSelectedSongs()}
            clearSelected={clearSelected}/>
          }
          {
            selected.length > 0 ||
            <button>Add Files</button>
          }
        </div>
      </nav> 
      <div className="artists view">
            {
              showNav &&
              <MusicNavigation toggleShowNav={toggleShowNav} object={artists} closeAndScroll={closeAndScroll}/>
            }
            {
              Object.keys(artists).sort().map(letter => (
                <section key={letter} id={letter}>
                  <h2 onClick={toggleShowNav}>{letter}</h2>
                  <div className="cards">
                    {
                      Array.from(artists[letter]).map(song => (
                        <SongTile
                          song={song}
                          key={song.tag.tags.title}
                          page={'artist'}
                          addToSelected={addToSelected}
                          selected={selected}
                          removeFromSelected={removeFromSelected}
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
