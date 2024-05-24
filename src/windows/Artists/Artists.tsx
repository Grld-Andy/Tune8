import React from 'react'
import './style.css'
import { songs } from '../../assets'
import SongTile from '../../components/SongTile/SongTile'
import { SortedSongs } from '../../data'

const Artists: React.FC = () => {
  const artists: SortedSongs[] = {}
  const uniqueArtists = [...new Set(songs.map(song => song.artist))]
  console.log(uniqueArtists)

  uniqueArtists.forEach(artist => {
    const firstLetter:string = artist.charAt(0).toUpperCase()
    console.log(firstLetter)
  })

  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Artists</h1>
        </div>
        <div className="nav-right">
          <button>Sort by</button>
          <button>Add Files</button>
        </div>
      </nav>
      <div className="artists view">
            {
              Object.keys(artists).sort().map(letter => (
                <section key={letter}>
                  <h2>{letter}</h2>
                  <div className="cards">
                    {
                      artists[letter].map(song => (
                        <SongTile
                          key={song.id}
                          song={song}
                          page={'artists'}
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
