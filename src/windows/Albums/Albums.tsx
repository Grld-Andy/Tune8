import React, { useContext, useEffect, useState } from 'react'
import './style.css'
import SongTile from '../../components/SongTile/SongTile'
import { Song, SortedSongs } from '../../data'
import MusicNavigation from '../../components/MusicNavigation/MusicNavigation'
import {AllSongsContext} from '../../contexts/AllSongsContext'
import SortButton from '../../components/SortButton/SortButton'
import { getSortedSongs } from '../../utilities'
import AddTo from '../../components/AddTo/AddTo'

const Albums: React.FC = () => {
  const {songs} = useContext(AllSongsContext)

  const [showNav, setShowNav] = useState(false)
  const toggleShowNav: () => void = () => {
    setShowNav(!showNav)
  }
  const closeAndScroll: () => void = () => {
    setShowNav(false)
  }

  // mulit select
  const [selected, setSelected] = useState<Array<Song>>([])
  const addToSelected = (songs: Array<Song>) => {
    setSelected([...selected, ...songs])
  }
  const clearSelected = () => {
    setSelected([])
  }

  // sort albums
  const [sortOrder, setSortOrder] = useState<string>(localStorage.getItem('albumsSortOrder') ?? 'albums')
  const [albums, setAlbums] = useState<SortedSongs>(getSortedSongs(songs, sortOrder, 'albums'))
  useEffect(() => {
    localStorage.setItem('albumsSortOrder', sortOrder)
    setAlbums(getSortedSongs(songs, sortOrder, 'albums'))
  }, [sortOrder, songs])

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Albums</h1>
        </div>
        <div className="nav-right">
          {
            selected.length > 0 &&
            <>
              <button>Play All</button>
              <button>Play Next</button>
              <AddTo/>
              <button onClick={clearSelected}>Clear All</button>
            </>
          }
          {
            selected.length > 0 ||
            <>
              <SortButton sortOrder={sortOrder} page={'albums'}
              setSortOrder={setSortOrder} showNav={showNav}/>
              <button>Add Files</button>
            </>
          }
        </div>
      </nav> 
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
