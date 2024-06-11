import React, { useContext, useState } from 'react'
import './style.css'
import SongTile from '../../components/SongTile/SongTile'
import {AllSongsContext} from '../../contexts/AllSongsContext'
import Buttons from '../../components/DynamicViews/Buttons/Buttons'
import { Song } from '../../data'

const Home: React.FC = () => {
  const {songs} = useContext(AllSongsContext)

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
  const deconstructSongTitle = (titlePlusAlbum:string) => {
    const songInfo = titlePlusAlbum.split('&_?')
    return {title: songInfo[0], album: songInfo[1]}
  }
  const getSelectedSongs: () => Array<Song> = () => {
    const selectedSongs: Array<Song> = selected.flatMap(selectedSong => {
      const songInfo = deconstructSongTitle(selectedSong)
      return songs.filter(item => 
        item.tag.tags.album === songInfo.album &&
        item.tag.tags.title === songInfo.title
      )
    })
    return selectedSongs
  }

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Home</h1>
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
      <div className="home view">
        <section>
          <h2>Recently Added</h2>
          <div className="cards">
            {
              songs.map(song => (
                <SongTile
                  key={song.tag.tags.title}
                  song={song}
                  page={'home'}
                  addToSelected={addToSelected}
                  selected={selected}
                  removeFromSelected={removeFromSelected}
                />
              ))
            }
          </div>
        </section>
      </div>
    </>
  )
}

export default Home
