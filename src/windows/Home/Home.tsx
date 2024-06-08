import React, { useContext } from 'react'
import './style.css'
import SongTile from '../../components/SongTile/SongTile'
import {AllSongsContext} from '../../contexts/AllSongsContext'

const Home: React.FC = () => {
  const {songs} = useContext(AllSongsContext)

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Home</h1>
        </div>
        <div className="nav-right">
          <button>Add Files</button>
        </div>
      </nav>
      <div className="home view">
        <section>
          <h2>Recently Added</h2>
          <div className="cards">
            {
              songs.map(song => (
                <SongTile key={song.tag.tags.title} song={song} page={'home'}/>
              ))
            }
          </div>
        </section>
      </div>
    </>
  )
}

export default Home
