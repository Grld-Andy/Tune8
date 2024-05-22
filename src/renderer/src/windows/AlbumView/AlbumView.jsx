import React, {useMemo} from 'react'
import { useParams } from 'react-router-dom'
import { BsPauseCircle, BsPlayCircle } from 'react-icons/bs'
import './AlbumView.css'

const AlbumView = ({allSongs, PlayPause, currentSong, isPlaying,
    handleContextMenu, handleMenuItemClick,
    contextMenuPosition, contextMenuVisible }) => {
    const {album} = useParams()

    const AlbumMap = useMemo(() => {
        const songs = allSongs.filter(song => song.tag.tags.album === album);
        return songs;
    }, [allSongs, album]);

    const totalDurationInSeconds = AlbumMap.reduce((total, song) => {
        let [minutes, seconds] = song.duration.split(':').map(Number);
        if(isNaN(minutes) || isNaN(seconds)){
            minutes = 0
            seconds = 0
        }
        return total + (minutes * 60) + seconds;
    }, 0)
    const totalSongs = AlbumMap.length;
    const totalDuration = formatDuration(totalDurationInSeconds)

    const releaseDate = AlbumMap.length > 0 ? AlbumMap[0].tag.tags.year : '#'

    function shuffleAndPlay(){
        const newQueue = shuffleArray(AlbumMap)
        PlayPause(newQueue[0], newQueue, true)
    }

    return (
        <div className="album-window">
            <nav>
                <h1>Albums</h1>
                <h1 onClick={showNowPlaying}
                style={{cursor: "pointer" }}
                id='now_playing456'>
                    Now Playing
                </h1>
            </nav>
            <div className='nav_space'></div>
            <div className="album_card">
                <div className='img'>
                    <img src={AlbumMap[0].imageSrc}
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = '/my_images/placeholders/music/3.jpg' 
                    }}/>
                </div>
                <div className='info'>
                    <div>
                        <h1>{album}</h1>
                        <div>Total Time: {totalDuration}</div>
                        <div>Total Songs: {totalSongs}</div>
                        <div>Release Date: {releaseDate}</div>
                    </div>
                    <div>
                        <button onClick={() => PlayPause(AlbumMap[0], AlbumMap, true)}>Play</button>
                        <button onClick={shuffleAndPlay}>Shuffle</button>
                    </div>
                </div>
            </div>
            <div className="albums-info">
                {
                    AlbumMap.length > 0
                    ? AlbumMap.map(song => {
                        return(
                        <div key={song.id}
                        onContextMenu={() => handleContextMenu(event, song, "Songs")}
                        className={song === currentSong ? 'highlight songs-info' : "songs-info"}
                        onClick={() => PlayPause(song, AlbumMap, true)}>
                            <div className="album_cover">
                                <img src={song.imageSrc}
                                onError={(e) => { 
                                    e.target.onerror = null; 
                                    e.target.src = '/my_images/placeholders/music/3.jpg' 
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
                            <h1 className='cell4'>{song.duration}</h1>
                        </div>
                        )
                    })
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

export default AlbumView