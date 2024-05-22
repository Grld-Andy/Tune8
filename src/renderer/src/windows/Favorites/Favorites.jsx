import './Favorites.css'
import { useState } from 'react'
import { BsPauseCircle, BsPlayCircle } from 'react-icons/bs'

const Favorites = ({ PlayPause, currentSong, isPlaying,
    favoriteSongs, setFavoriteSongs, handleContextMenu,
    handleMenuItemClick, contextMenuPosition, contextMenuVisible}) => {

    function ShuffleAndPlay(){
        const newQueue = shuffleArray(favoriteSongs)
        PlayPause(newQueue[0], newQueue, true)
    }

    return (
        <div className="favorites_window">
            <nav>
                <div className='nav'>
                    <h1>Favorites</h1>
                    <div>
                        <button type='button' onClick={() => PlayPause(allSongs[0], allSongs, true)}>
                            Play All
                        </button>
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
                    favoriteSongs.length > 0
                    ?favoriteSongs.map(song => (
                        <li onClick={() => PlayPause(song, favoriteSongs, true)} key={song.index}
                        className={song === currentSong ? 'highlight' : ""}
                        onContextMenu={() => handleContextMenu(event, song, "Favorites")}>
                            <div className="img_div">
                                <img src={song.imageSrc}/>
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
                        <h1>No favorite song</h1>
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
                        <div className="context-menu-item" onClick={() => handleMenuItemClick('AddToQueue')}>
                            Add to Queue
                        </div>
                        <div className="context-menu-item" onClick={() => handleMenuItemClick('AddToPlaylist')}>
                            Add to Playlist
                        </div>
                        <div className="context-menu-item" onClick={() => handleMenuItemClick('RemoveFromFavorite')}>
                            Remove from Favorite
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Favorites