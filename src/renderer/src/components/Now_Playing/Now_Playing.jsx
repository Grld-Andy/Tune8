import { useState, useRef, useEffect } from 'react'
import './Now_Playing.css'
import {FaRotate, FaCirclePause, FaCirclePlay, FaShuffle, FaForward, FaBackward, FaXmark, FaAngleLeft, FaAngleRight} from 'react-icons/fa6'
import {ImEnlarge} from 'react-icons/im'
import {HiMiniWindow} from 'react-icons/hi2'
import {MdOutlineFavorite, MdFavoriteBorder, MdFavorite} from 'react-icons/md'

const Now_Playing = ({isPlaying, PlayPause, audioElem, nextSong, prevSong,
    musicProgress, setMusicProgress, currentSong, setCurrentSong, queueSongs, currentIndex,
    favoriteSongs, setFavoriteSongs, setAllSongs, allSongs}) => {
    const [viewLyrics, setViewLyrics] = useState(false)
    const [songLyrics, setSongLyrics] = useState("Searching...")
    const [isFavorite, setIsFavorite] = useState(false)
    const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

    const handleToggleAlwaysOnTop = () => {
        window.electron.makeMini();
    }

    function ShuffleAndPlay(){
        const newQueue = shuffleArray(queueSongs)
        PlayPause(newQueue[0], newQueue, true)
    }

    function displayLyrics(){
        showLyrics()
        setViewLyrics(true)
    }

    async function FavoritesToggle(songToToggle){
        try {
            // updatedisfavorite => 1 if set to favorite
            //                      0 if removed from favorite
            //                      -1 if failed to update
            const updatedIsFavorite = await window.electron.favoritesToggle({songToToggle: songToToggle, newValue: currentSong.isFavorite ? 0 : 1})
            if(updatedIsFavorite == -1){
                console.error("Failed to update song")
            }
            const value = !!updatedIsFavorite
            if(songToToggle === currentSong){
                setIsFavorite(value)
            }
            if(value){
                setFavoriteSongs([...favoriteSongs, songToToggle]);
            }else{
                console.log("previous favorites: ", favoriteSongs)
                const prevFavorites = favoriteSongs.filter(favSong => favSong.id !== songToToggle.id);
                console.log("current favorites: ", prevFavorites)
                setFavoriteSongs(prevFavorites);
            }
            const updatedCurrentSong = { ...currentSong, isFavorite: value };
            setCurrentSong(updatedCurrentSong);
        } catch (error) {
            console.error('Error toggling favorite:', error)
        }
    }

    const handleContextMenu = (e, song) => {
        e.preventDefault()
        console.log('Right-clicked on song:', song);
    };

    useEffect(() => {
        setSongLyrics("Searching")
        const fetchLyrics = async () => {
            const newLyrics = await window.electron.getLyrics(currentSong);
            setSongLyrics(newLyrics);
        };
        fetchLyrics();
        if(currentSong){
            setIsFavorite(currentSong.isFavorite)
        }
    }, [currentSong]);

    function HideNowPlaying(){
        setViewLyrics(false)
        hideNowPlaying()
    }

    function HideLyrics(){
        hideLyrics()
        setViewLyrics(false)
    }

    const clickRef = useRef()
    const checkWidth = (e) => {
        let width = clickRef.current.clientWidth;
        const offset = e.nativeEvent.offsetX;

        const divprogress = offset/width * 100;
        audioElem.current.currentTime = divprogress/100 * audioElem.current.duration;
    }

    return (
    <>
    <div className="overlay" onClick={HideNowPlaying}></div>
        <div className='now-playing'>
            <div>
                <nav>
                    <h1></h1>
                    <div className='x_mark'>
                        {
                            currentSong &&
                            <div>
                                {
                                    viewLyrics
                                    ?<FaAngleRight size={25} onClick={HideLyrics}/>
                                    :<FaAngleLeft size={25} onClick={displayLyrics}/>
                                }
                            </div>
                        }
                        <div className='XMark'>
                            <FaXmark onClick={HideNowPlaying} size={30}/>
                        </div>
                    </div>
                </nav>
                {
                    currentSong ?
                    <div className="upper">
                        <div className="img disk">
                            <img src={currentSong.imageSrc}/>
                        </div>
                        <div className="song-title">
                            <h3 style={{textAlign: "center"}}>
                                {currentSong.tag.tags.title}
                            </h3>
                        </div>
                        <div className='artist_album'>
                            <h3 className='s_title'>{currentSong.tag.tags.artist}</h3>
                            <h3 className='s_album'>{currentSong.tag.tags.album}</h3>
                        </div>
                        <div className="time">
                            <p id='start'>
                                {`${writeTime(Math.floor(musicProgress / 60))}:${writeTime(Math.floor(musicProgress % 60))}`}
                            </p>
                            <div className="custom_progress" onClick={checkWidth} ref={clickRef}>
                                <div className="progress_bar" style={{width: `${(musicProgress/audioElem.current.duration) * 100}%`}}>
                                    <div className="progress_thumb"></div>
                                </div>
                            </div>
                            <p id='end'>
                                {currentSong.duration}
                            </p>
                        </div>
                        <audio src={currentSong.url} ref={audioElem}></audio>
                        <div className="time-icons">
                            <div className='sides'>
                                <FaShuffle id='time-icon' size={20} style={{cursor: "pointer"}} onClick={ShuffleAndPlay}/>
                                <HiMiniWindow id='time-icon' size={22} style={{cursor: "pointer"}} onClick={handleToggleAlwaysOnTop}/>
                            </div>
                            <div className='bpf'>
                                <FaBackward id='time-icon' size={20} style={{cursor: "pointer"}} onClick={prevSong}/>
                                {
                                    isPlaying
                                        ? <FaCirclePause id="plause" style={{cursor: "pointer"}} onClick={() => PlayPause(currentSong, [], false)}/>
                                        : <FaCirclePlay id="plause" style={{cursor: "pointer"}}  onClick={() => PlayPause(currentSong, [], false)}/>
                                }
                                <FaForward id='time-icon' size={20} style={{cursor: "pointer"}} onClick={nextSong}/>
                            </div>
                            <div className='sides'>
                                {
                                    currentSong.isFavorite||isFavorite
                                    ?<MdFavorite id='time-icon' size={25} style={{cursor: "pointer"}} onClick={() => FavoritesToggle(currentSong)}/>
                                    :<MdFavoriteBorder id='time-icon' size={25} style={{cursor: "pointer"}} onClick={() => FavoritesToggle(currentSong)}/>
                                }
                                <FaRotate id='time-icon' size={20} style={{cursor: "pointer"}}/>
                            </div>
                        </div>
                    </div>
                    :
                    <>
                        <h3>No Song Playing, please load a song</h3>
                        <audio src="" ref={audioElem}></audio>
                    </>
                }
            <div className='lower'>
                <h2>Queue</h2>
                <div className="queue-list">
                    {
                        currentIndex === -1 
                        ? queueSongs.slice(0, 5).map(song => (
                            <div  className={song === currentSong ? 'highlight queue-cell' : "queue-cell"} key={song.id}
                            onClick={() => PlayPause(song, [], false)} onContextMenu={(e) => handleContextMenu(e, song)}>
                                <div className='image_name'>
                                    <img src={song.imageSrc}/>
                                    <div>
                                        <h4 className='title'>{sliceText(song.tag.tags.title, 20)}</h4>
                                        <h4 className='artist'>{song.tag.tags.artist}</h4>
                                    </div>
                                </div>
                                <div className='time'>
                                    <h4>{song.duration}</h4>
                                </div>
                            </div>
                        ))
                        : currentIndex + 5 > queueSongs.length -1 
                        ? queueSongs.slice(queueSongs.length - 5).map(song => (
                            <div  className={song === currentSong ? 'highlight queue-cell' : "queue-cell"} key={song.id} onClick={() => PlayPause(song, [], false)}>
                                <div className='image_name'>
                                    <img src={song.imageSrc}/>
                                    <div>
                                        <h4 className='title'>{sliceText(song.tag.tags.title, 20)}</h4>
                                        <h4 className='artist'>{song.tag.tags.artist}</h4>
                                    </div>
                                </div>
                                <div className='time'>
                                    <h4>{song.duration}</h4>
                                </div>
                            </div>
                        ))
                        : queueSongs.slice(currentIndex, currentIndex + 5).map(song => (
                            <div  className={song === currentSong ? 'highlight queue-cell' : "queue-cell"} key={song.id} onClick={() => PlayPause(song, [], false)}>
                                <div className='image_name'>
                                    <img src={song.imageSrc}/>
                                    <div>
                                        <h4 className='title'>{sliceText(song.tag.tags.title, 20)}</h4>
                                        <h4 className='artist'>{song.tag.tags.artist}</h4>
                                    </div>
                                </div>
                                <div className='time'>
                                    <h4>{song.duration}</h4>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
        {
            currentSong
            ?<div className="lyrics_container">
                <div className="title">
                    <h1>{currentSong.tag.tags.title}</h1>
                </div>
                <div className="lyrics">
                    <div className='lyrics_words'>
                    <div dangerouslySetInnerHTML={{ __html: songLyrics }} />
                    </div>
                </div>
            </div>
            :<div className="lyrics_container">
                <div className="title">
                    <h1>Replace condition with lyrics later</h1>
                </div>
                <div className="lyrics">
                    <p>No lyrics found for song</p> 
                </div>
            </div>
        }
    </div>
    {
        currentSong && 
        <div className="mini-player">
            <div className='mini-back' style={{backgroundImage: `url(${currentSong.imageSrc})`}}></div>
            <div className="mini-window">
                <div className="tools">
                    <div className="song-title">
                        <h3 style={{textAlign: "center"}}>
                            {currentSong.tag.tags.title}
                        </h3>
                    </div>
                    <div className="time">
                        <p id='start'>
                            {`${writeTime(Math.floor(musicProgress / 60))}:${writeTime(Math.floor(musicProgress % 60))}`}
                        </p>
                        <div className="custom_progress" onClick={checkWidth} ref={clickRef}>
                            <div className="progress_bar" style={{width: `${(musicProgress/audioElem.current.duration) * 100}%`}}>
                                <div className="progress_thumb"></div>
                            </div>
                        </div>
                        <p id='end'>
                            {currentSong.duration}
                        </p>
                    </div>
                    <div className="mini-time-icons">
                        <div className='sides'>
                            <FaShuffle id='mini-time-icon' size={20} style={{cursor: "pointer"}} onClick={ShuffleAndPlay}/>
                            <HiMiniWindow id='mini-time-icon' size={22} style={{cursor: "pointer"}} onClick={handleToggleAlwaysOnTop}/>
                        </div>
                        <div className='bpf'>
                            <FaBackward id='mini-time-icon' size={20} style={{cursor: "pointer"}} onClick={prevSong}/>
                            {
                                isPlaying
                                ? <FaCirclePause id="plause" style={{cursor: "pointer"}} onClick={() => PlayPause(currentSong, [], false)}/>
                                : <FaCirclePlay id="plause" style={{cursor: "pointer"}}  onClick={() => PlayPause(currentSong, [], false)}/>
                            }
                            <FaForward id='mini-time-icon' size={20} style={{cursor: "pointer"}} onClick={nextSong}/>
                        </div>
                        <div className='sides'>
                            {
                                currentSong.isFavorite||isFavorite
                                ?<MdFavorite id='mini-time-icon' size={25} style={{cursor: "pointer"}} onClick={() => FavoritesToggle(currentSong)}/>
                                :<MdFavoriteBorder id='mini-time-icon' size={25} style={{cursor: "pointer"}} onClick={() => FavoritesToggle(currentSong)}/>
                            }
                            <FaRotate id='mini-time-icon' size={20} style={{cursor: "pointer"}}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
    </>
    )
}

export default Now_Playing