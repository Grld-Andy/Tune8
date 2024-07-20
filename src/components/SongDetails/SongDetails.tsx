import React from 'react'
import { Song } from '../../data'

interface Props{
    query: Song
}

const SongDetails: React.FC<Props> = ({query}) => {
  return (
    <div className="song-details">
        <div className="details-container">
            <h1>Song details</h1>
            <div className="main-info">
                <div className="tile">
                    <h3>Title</h3>
                    <h4>{query.tag.tags.title}</h4>
                </div>
                <div className="tile">
                    <h3>Album</h3>
                    <h4>{query.tag.tags.album}</h4>
                </div>
                <div className="tile">
                    <h3>Artist</h3>
                    <h4>{query.tag.tags.artist}</h4>
                </div>
                <div className="tile">
                    <h3>Year Released</h3>
                    <h4>{query.tag.tags.year}</h4>
                </div>
                <div className="tile">
                    <h3>Song Duration</h3>
                    <h4>{query.duration}</h4>
                </div>
                <div className="tile">
                    <h3>Genre</h3>
                    <h4>{query.tag.tags.genre}</h4>
                </div>
            </div>
            <div className="source">
                <h2>{query.src}</h2>
            </div>
        </div>
    </div>
  )
}

export default SongDetails
