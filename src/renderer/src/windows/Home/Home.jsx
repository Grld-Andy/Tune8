import React, { useMemo, useState } from 'react'
import { songs } from '../../constants'
import { BsPlayCircle, BsPauseCircle } from 'react-icons/bs';
import './Home.css'

const Home = ({lastSongs, recentSongs, PlayPause, currentSong,
    isPlaying}) => {

    return (
        <div className="home-window">
            <nav>
                <h1>Home</h1>
                <h1 onClick={showNowPlaying}
                style={{cursor: "pointer" }}
                id='now_playing456'>
                    Now Playing
                </h1>
            </nav>
            <div className="recent">
                <div className="nav_space"></div>
                <h1 id="first_home">Recently Added</h1>
                <div className="music-grid">
                    {
                        recentSongs
                        ?recentSongs.map(song => (
                            <div className='music-cell' key={song.id}>
                                <div onClick={() => PlayPause(song, [song], true)}>
                                    {
                                        currentSong
                                        ?currentSong.id == song.id && isPlaying
                                            ?<BsPauseCircle/>
                                            :<BsPlayCircle/>
                                        :<BsPlayCircle/>
                                    }
                                </div>
                                <img src={song.imageSrc}
                                onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = '/my_images/placeholders/music/2.jpg' 
                                }}/>
                                <p>{song.tag.tags.title}</p>
                            </div>
                        ))
                        :<h1>No song played yet</h1>
                    }
                </div>
            </div>
            <div className="recent">
                <h1>Recently Played</h1>
                <div className="music-grid">
                    {
                        lastSongs
                        ?lastSongs.map(song => (
                            <div className='music-cell' key={song.id}>
                                <div onClick={() => PlayPause(song, [song], true)}>
                                    {
                                        currentSong
                                        ?currentSong.id == song.id
                                            ?<BsPauseCircle/>
                                            :<BsPlayCircle/>
                                        :<BsPlayCircle/>
                                    }
                                </div>
                                <img src={song.imageSrc}
                                onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = '/my_images/placeholders/music/2.jpg' 
                                }}/>
                                <p>{song.tag.tags.title}</p>
                            </div>
                        ))
                        :<h1>No song played yet</h1>
                    }
                </div>
            </div>
        </div>
    )
}

export default Home