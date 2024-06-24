import React, { useContext, useState } from 'react'
import './style.css'
import SongTile from '../../components/SongTile/SongTile'
import {AllSongsContext} from '../../contexts/AllSongsContext'
import Buttons from '../../components/Buttons/Buttons'
import { Song } from '../../data'
import AddMusicFolderButton from '../../components/Buttons/AddMusicFolder/AddMusicFolder'

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
  const getSelectedSongs: () => Array<Song> = () => {
    const selectedSongs: Array<Song> = selected.flatMap(selectedSong => {
      return songs.filter(item => item.id === selectedSong)
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
            <AddMusicFolderButton/>
          }
        </div>
      </nav>
      {
        songs.length > 0?
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
        </div>:
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

export default Home
