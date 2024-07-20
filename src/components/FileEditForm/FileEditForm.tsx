import React, { useContext } from 'react'
import { SongFormContext } from '../../contexts/SongFormContext'
import './style.css'

const FileEditForm: React.FC = () => {
    const {songForm} = useContext(SongFormContext)

  return (
    <>
    {
        songForm.isOpen && songForm.song &&
        <div className="song-details">
            <div className="details-container">
                <h1>Song details</h1>
                <div className="main-info">
                    <div className="tile">
                        <h3>Title</h3>
                        <h4>{songForm.song.tag.tags.title}</h4>
                    </div>
                    <div className="tile">
                        <h3>Album</h3>
                        <h4>{songForm.song.tag.tags.album}</h4>
                    </div>
                    <div className="tile">
                        <h3>Artist</h3>
                        <h4>{songForm.song.tag.tags.artist}</h4>
                    </div>
                    <div className="tile">
                        <h3>Year Released</h3>
                        <h4>{songForm.song.tag.tags.year}</h4>
                    </div>
                    <div className="tile">
                        <h3>Song Duration</h3>
                        <h4>{songForm.song.duration}</h4>
                    </div>
                    <div className="tile">
                        <h3>Genre</h3>
                        <h4>{songForm.song.tag.tags.genre}</h4>
                    </div>
                </div>
                <div className="source">
                    <h2>{songForm.song.src}</h2>
                </div>
            </div>
        </div>
    }
    </>
  )
}

export default FileEditForm
