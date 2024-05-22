import './Queue.css'
import { useEffect, useState } from 'react'
import { BsPauseCircle, BsPlayCircle } from 'react-icons/bs'

const Queue = ({ PlayPause, currentSong, isPlaying, queueSongs,
    handleContextMenu, handleMenuItemClick, contextMenuPosition,
    contextMenuVisible }) => {
    const [visibleSongs, setVisibleSongs] = useState(40);
    const [totalSongs, setTotalSongs] = useState(queueSongs.length);

    function ShuffleAndPlay(){
        const newQueue = shuffleArray(queueSongs)
        PlayPause(newQueue[0], newQueue, true)
    }
    useEffect(() => {
        setTotalSongs(queueSongs.length);
    }, [queueSongs]);

    useEffect(() => {
        setInterval(() => {
            setVisibleSongs(prevVisibleSongs => Math.min(totalSongs, prevVisibleSongs + 50))
        }, 50)
    }, [totalSongs])

    return (
        <div className="queue_window">
            <nav>
                <div className='nav'>
                    <h1>Queue</h1>
                    <div>
                        <button type='button' onClick={() => ShuffleAndPlay()}>
                            Shuffle
                        </button>
                    </div>
                </div>
                <h1 onClick={showNowPlaying}
                style={{cursor: "pointer" }}
                id='now_playing456'>
                    Now Playing
                </h1>
            </nav>
            <ul>
                {
                    queueSongs.length > 0
                    ?queueSongs.slice(0, visibleSongs).map(song => (
                        <li onClick={() => PlayPause(song, queueSongs, true)} key={song.id}
                        onContextMenu={() => handleContextMenu(event, song, "Queue")}
                        className={song === currentSong ? 'highlight' : ""}>
                            <div className="img_div">
                                <img src={song.imageSrc}
                                onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = '/my_images/placeholders/music/4.jpg'
                                }}/>
                                <div>
                                    {
                                        (currentSong === song && isPlaying)
                                        ? <BsPauseCircle/>
                                        : <BsPlayCircle/>
                                    }
                                    
                                </div>
                            </div>
                            <h2 className='cell2'>{song.tag.tags.title}</h2>
                            <h2 className='cell3'>{song.tag.tags.artist}</h2>
                            <h2 className='cell4'>{song.tag.tags.album}</h2>
                            <h2 className='cell5'>{song.duration}</h2>
                        </li>
                    ))
                    : 
                    <div className='no_queue'>
                        <h1>No songs in queue</h1>
                    </div>
                }
            </ul>
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
                        <div className="context-menu-item" onClick={() => handleMenuItemClick('RemoveFromQueue')}>
                            Remove from Queue
                        </div>
                        <div className="context-menu-item" onClick={() => handleMenuItemClick('AddToPlaylist')}>
                            Add to Playlist
                        </div>
                        <div className="context-menu-item" onClick={() => handleMenuItemClick('AddToFavorite')}>
                            Add to Favorite
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Queue