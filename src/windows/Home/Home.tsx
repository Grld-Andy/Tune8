import React from 'react'
import './style.css'
import { songs } from '../../assets'
import SongTile from '../../components/SongTile/SongTile'

const Home: React.FC = () => {
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
                <SongTile song={song}/>
              ))
            }
          </div>
        </section>
      </div>
    </>
  )
}

export default Home
