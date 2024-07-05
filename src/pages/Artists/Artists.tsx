import React, { useContext, useMemo, useState } from 'react'
import './style.css'
import SongTile from '../../components/SongTile/SongTile'
import { Song, SortedSongs } from '../../data'
import MusicNavigation from '../../components/MusicNavigation/MusicNavigation'
import { AllSongsContext } from '../../contexts/AllSongsContext'
import Buttons from '../../components/Buttons/Buttons'
import AddMusicFolderButton from '../../components/Buttons/AddMusicFolder/AddMusicFolder'

const Artists: React.FC = () => {
  const {songs} = useContext(AllSongsContext)

  const [showNav, setShowNav] = useState(false)
  const toggleShowNav: () => void = () => {
    setShowNav(!showNav)
  }
  const closeAndScroll = (letter: string) => {
    document.getElementById(letter)?.scrollIntoView({ behavior: 'smooth' })
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
  const getSelectedSongs = useMemo(() => {
    return () => {
      const selectedSongs: Array<Song> = selected.flatMap(selectedArtist => {
        return songs.filter(item => item.tag.tags.artist === selectedArtist)
      })
      return selectedSongs
    }
  }, [selected, songs])

  // get artists
  const artists: SortedSongs = useMemo(() => {
    const artistMap: SortedSongs = {}
    songs.forEach(song => {
      let firstLetter: string = song.tag.tags.artist.charAt(0).toUpperCase()
      firstLetter = /^[A-Za-z]$/.test(firstLetter) ? firstLetter : '#'
      // initialize to store empty array before pushing
      if (!artistMap[firstLetter]) {
        artistMap[firstLetter] = new Set()
      }
      if (!Array.from(artistMap[firstLetter]).some(elem => elem.tag.tags.artist === song.tag.tags.artist)) {
        artistMap[firstLetter].add(song)
      }
    })
    return artistMap
  }, [songs])

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
            <AddMusicFolderButton/>
          }
        </div>
      </nav> 
      {
        songs.length > 0?
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
        :
        <div className="empty-window view">
          <div className="cell">
            <h1>No songs</h1>
            <AddMusicFolderButton text={'Add +'}/>
          </div>
        </div>
      }
      
    </>
  )
}

export default Artists
