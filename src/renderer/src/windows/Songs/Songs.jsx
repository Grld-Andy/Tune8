import React, { useEffect, useMemo, useState } from 'react';
import './Songs.css';
import { BsPauseCircle, BsPlayCircle } from 'react-icons/bs';
import { debounce } from 'lodash';

const Songs = ({ allSongs, PlayPause, currentSong, isPlaying,
    handleContextMenu, handleMenuItemClick,
    contextMenuPosition, contextMenuVisible }) => {
    const [visibleSongs, setVisibleSongs] = useState(20);
    const [totalSongs, setTotalSongs] = useState(allSongs.length);
    const [searchSongs, setSearchSongs] = useState("");
    const [querySongs, setQuerySongs] = useState([]);

    useEffect(() => {
        setTotalSongs(allSongs.length);
    }, [allSongs]);

    const searchingSongs = debounce((value) => {
        setSearchSongs(value.toLowerCase());
        if (value !== "") {
            const query = allSongs.filter(song => song.tag.tags.title.toLowerCase().includes(value));
            setQuerySongs(query);
            setVisibleSongs(50)
        } else {
            setQuerySongs([]);
        }
    }, 300);

    function ShuffleAndPlay() {
        const newQueue = shuffleArray(allSongs);
        PlayPause(newQueue[0], newQueue, true);
    }

    const renderedSongs = useMemo(() => {
        return searchSongs === ""
            ? allSongs.slice(0, visibleSongs).map(song => (
                <li
                onContextMenu={() => handleContextMenu(event, song, "Songs")}
                onClick={() => PlayPause(song, allSongs, true)} key={song.id} className={song === currentSong ? 'highlight' : ""}>
                    <div className="img_div">
                        <img src={song.imageSrc}/>
                        <div>
                            {currentSong === song && isPlaying ? <BsPauseCircle /> : <BsPlayCircle />}
                        </div>
                    </div>
                    <h2 className='cell2'>{song.tag.tags.title}</h2>
                    <h2 className='cell3'>{song.tag.tags.artist}</h2>
                    <h2 className='cell4'>{song.tag.tags.album}</h2>
                    <h2 className='cell5'>{song.duration}</h2>
                </li>
            ))
            : querySongs.length === 0
                ? <h1 id='notFound'>No result found</h1>
                : querySongs.map(song => (
                    <li
                    onContextMenu={() => handleContextMenu(event, song, "Songs")}
                    onClick={() => PlayPause(song, allSongs, true)} key={song.id} className={song === currentSong ? 'highlight' : ""}>
                        <div className="img_div">
                            <img src={song.imageSrc}/>
                            <div>
                                {currentSong === song && isPlaying ? <BsPauseCircle /> : <BsPlayCircle />}
                            </div>
                        </div>
                        <h2 className='cell2'>{song.tag.tags.title}</h2>
                        <h2 className='cell3'>{song.tag.tags.artist}</h2>
                        <h2 className='cell4'>{song.tag.tags.album}</h2>
                        <h2 className='cell5'>{song.duration}</h2>
                    </li>
                ));
    }, [allSongs, currentSong, isPlaying, PlayPause, visibleSongs, querySongs, searchSongs]);

    // stream songs
    useEffect(() => {
        setInterval(() => {
            setVisibleSongs(prevVisibleSongs => Math.min(prevVisibleSongs + 30, totalSongs))
        }, 50)
    }, [totalSongs])

    return (
        <div className="songs_window">
            <nav>
                <div className='nav'>
                    <h1>Songs</h1>
                    <div>
                        <button type='button' onClick={() => PlayPause(allSongs[0], allSongs, true)}>
                            Play All
                        </button>
                        <button type='button' onClick={ShuffleAndPlay}>
                            Shuffle
                        </button>
                    </div>
                </div>
                <div className='nowPlay'>
                    <h1 onClick={showNowPlaying} style={{ cursor: "pointer" }} id='now_playing456'>
                        Now Playing
                    </h1>
                    <div className='search'>
                        <input type='text' placeholder='Search' onChange={(e) => searchingSongs(e.target.value)} />
                    </div>
                </div>
            </nav>
            {
                allSongs.length === 0
                    ? <div className="loader" style={{ position: "relative", top: "90px" }}>
                        <div className="circle_loader"></div>
                        <div className="box_loader"></div>
                    </div>
                    : <ul>
                        {renderedSongs}
                    </ul>
            }
            
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
    );
}

export default Songs;
