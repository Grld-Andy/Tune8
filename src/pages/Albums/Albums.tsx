import React, { useContext, useEffect, useState, useMemo } from 'react'
import './style.css'
import SongTile from '../../components/SongTile/SongTile'
import { Song } from '../../data'
import MusicNavigation from '../../components/MusicNavigation/MusicNavigation'
import {AllSongsContext} from '../../contexts/AllSongsContext'
import SortButton from '../../components/SortButton/SortButton'
import { getSortedSongs } from '../../utilities'
import Buttons from '../../components/Buttons/Buttons'
import AddMusicFolderButton from '../../components/Buttons/AddMusicFolder/AddMusicFolder'

const Albums: React.FC = () => {
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
      const selectedSongs: Array<Song> = selected.flatMap(selectedAlbum => {
        return songs.filter(item => item.tag.tags.album === selectedAlbum)
      })
      return selectedSongs
    }
  }, [selected, songs])
  
  // sort albums
  const [sortOrder, setSortOrder] = useState<string>(localStorage.getItem('albumsSortOrder') ?? 'album')
  const albums = useMemo(() => getSortedSongs(songs, sortOrder, 'albums'), [songs, sortOrder])
  useEffect(() => {
    localStorage.setItem('albumsSortOrder', sortOrder)
  }, [sortOrder])

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Albums</h1>
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
              <SortButton sortOrder={sortOrder} page={'albums'}
              setSortOrder={setSortOrder} showNav={showNav}/>
              <AddMusicFolderButton/>
            </>
          }
        </div>
      </nav>
      {
        songs.length > 0?
        <div className="albums view">
            {
              showNav &&
              <MusicNavigation toggleShowNav={toggleShowNav}
              sortOrder={sortOrder}
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

export default Albums
