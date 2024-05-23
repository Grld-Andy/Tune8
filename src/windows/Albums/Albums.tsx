import React from 'react'
import './style.css'
import { songs } from '../../assets'
import SongTile from '../../components/SongTile/SongTile'
import { AlbumsInterface } from '../../data'

const Albums: React.FC = () => {
  const albums: AlbumsInterface[] = {}

  songs.forEach(song => {
    const firstLetter:string = song.album.charAt(0).toUpperCase()
    if (!albums[firstLetter]) {
      albums[firstLetter] = []
    }
    albums[firstLetter].push(song)
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
              Object.keys(albums).sort().map(letter => (
                <section key={letter}>
                  <h2>{letter}</h2>
                  <div className="cards">
                    {
                      albums[letter].map(song => (
                        <SongTile
                          key={song.id}
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
