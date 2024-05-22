import React, {useEffect, useMemo} from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { BsPauseCircle, BsPlayCircle } from 'react-icons/bs'
import './ArtistView.css'

const ArtistView = ({allSongs, PlayPause, currentSong, isPlaying,
    handleContextMenu, handleMenuItemClick,
    contextMenuPosition, contextMenuVisible }) => {
    const {artist} = useParams()

    const artistAlbumsMap = useMemo(() => {
        const songs = allSongs.filter(song => song.tag.tags.artist.startsWith(artist));
        songs.sort((a, b) => a.tag.tags.album.localeCompare(b.tag.tags.album));
        return songs
    }, [allSongs, artist])

    const totalSongs = artistAlbumsMap.length
    const totalDurationInSeconds = artistAlbumsMap.reduce((total, song) => {
        let [minutes, seconds] = song.duration.split(':').map(Number);
        if(isNaN(minutes) || isNaN(seconds)){
            minutes = 0
            seconds = 0
        }
        return total + (minutes * 60) + seconds;
    }, 0)
    
    const totalAlbums = new Set(artistAlbumsMap.map(song => song.tag.tags.album)).size
    const totalDuration = formatDuration(totalDurationInSeconds)
    function shuffleAndPlay(){
        const newQueue = shuffleArray(artistAlbumsMap)
        PlayPause(newQueue[0], newQueue, true)
    }

    return (
        <div className="artist-window">
            <nav>
                <h1>Artists</h1>
                <h1 onClick={showNowPlaying}
                style={{cursor: "pointer" }}
                id='now_playing456'>
                    Now Playing
                </h1>
            </nav>
            <div className='nav_space'></div>
            <div className="artist_card">
                <div className='img'>
                    <img src={artistAlbumsMap[0].imageSrc}
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = '/my_images/placeholders/music/2.jpg' 
                    }}/>
                </div>
                <div className='info'>
                    <div>
                        <h1>{artist}</h1>
                        <div>Total Songs: {totalSongs}</div>
                        <div>Total Duration: {totalDuration}</div>
                        <div>Total Albums: {totalAlbums}</div>
                    </div>
                    <div>
                        <button onClick={() => PlayPause(artistAlbumsMap[0], artistAlbumsMap, true)}>Play</button>
                        <button onClick={shuffleAndPlay}>Shuffle</button>
                    </div>
                </div>
            </div>
            <div className="albums-info">
                {
                    artistAlbumsMap.length > 0
                    ? artistAlbumsMap.map(song => (
                        <div key={song.id}
                        onContextMenu={() => handleContextMenu(event, song, "Songs")}
                        className={song === currentSong ? 'highlight songs-info' : "songs-info"}
                        onClick={() => PlayPause(song, artistAlbumsMap, true)}>
                            <div className="album_cover">
                                <img src={song.imageSrc}
                                onError={(e) => { 
                                    e.target.onerror = null; 
                                    e.target.src = '/my_images/placeholders/music/2.jpg' 
                                }}/>
                                <div>
                                    {
                                        (currentSong === song && isPlaying)
                                        ? <BsPauseCircle/>
                                        : <BsPlayCircle/>
                                    }
                                </div>
                            </div>
                            <h1 className='cell2'>{song.tag.tags.title}</h1>
                            <h1 className='cell3'>{song.tag.tags.album}</h1>
                            <h1 className='cell3'>{song.tag.tags.genre}</h1>
                            <h1 className='cell3'>{song.tag.tags.year}</h1>
                            <h1 className='cell4'>{song.duration}</h1>
                        </div>
                    ))
                    :<h2>No albums</h2>
                }
            </div>
            
            {contextMenuVisible && (
                <div className="container">
                    <div className="context-menu" style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}>
                        <div className="context-menu-item" onClick={() => handleMenuItemClick('Play')}>
                            Play
                        </div>
                        <div className="context-menu-item" onClick={() => handleMenuItemClick('PlayNext')}>
                            Play Next
                        </div>
                        <hr/>
                        <div className="context-menu-item" onClick={() => handleMenuItemClick('AddToQueue')}>
                            Add to Queue
                        </div>
                        <div className="context-menu-item" onClick={() => handleMenuItemClick('AddToPlaylist')}>
                            Add to Playlist
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ArtistView