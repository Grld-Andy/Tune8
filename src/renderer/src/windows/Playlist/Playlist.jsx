import React from 'react'
import './Playlist.css'

const Playlist = ({ PlayPause, currentSong, isPlaying, queueSongs }) => {
    return (
        <div className="playlist-window">
            <nav>
                <h1>Playlist</h1>
                <h1 onClick={showNowPlaying}
                style={{cursor: "pointer" }}
                id='now_playing456'>
                    Now Playing
                </h1>
            </nav>
            <div className="nav_space"></div>
            <div className="playlists">
                <h1>No playlist added yet</h1>
            </div>
        </div>
    )
}

export default Playlist