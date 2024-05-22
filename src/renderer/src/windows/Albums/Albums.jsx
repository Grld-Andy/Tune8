import React, { useState, useMemo } from 'react'
import { alphabets } from '../../constants';
import './Albums.css'
import { BsPlayCircle } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const Albums = ({allSongs}) => {
    const [showLetter, setShowLetters] = useState(false)

    function closeLetterView(){
        setShowLetters(!showLetter)
    }
    function closeAndScrollLetterView(){
        setShowLetters(!showLetter)
        setTimeout(() => {
            window.scrollBy({
                top: -90,
                behavior: 'smooth'
            });
        }, 30)
    }
    const albumMap = useMemo(() => {
        return alphabets.reduce((acc, alphabet) => {
            const albums = allSongs.filter(song => song.tag.tags.album.toLowerCase().startsWith(alphabet.toLowerCase()));
            const uniqueAlbums = [...new Set(albums.map(song => song.tag.tags.album))];
            acc[alphabet] = uniqueAlbums;
            return acc;
        }, {});
    }, [allSongs]);

    return (
        <div className="albums-window">
            <nav>
                <h1>Albums</h1>
                <h1 onClick={showNowPlaying}
                style={{cursor: "pointer" }}
                id='now_playing456'>
                    Now Playing
                </h1>
            </nav>
            <div className='nav_space'></div>
            {
                allSongs.length === 0
                ?<div className="loader">
                    <div className="circle_loader"></div>
                    <div className="box_loader"></div>
                </div>
                :(
                    alphabets.map(alphabet => {
                        const uniqueAlbums = albumMap[alphabet] || []
                        if(uniqueAlbums.length > 0){
                            return(
                            <section id={alphabet} key={alphabet}>
                                <h1 onClick={closeLetterView}>{alphabet.toUpperCase()}</h1>
                                <div className="album-flex">
                                    {uniqueAlbums.map(album => {
                                        const albumData = allSongs.find(song => song.tag.tags.album.toLowerCase() === album.toLowerCase())
                                        if(albumData){
                                            return(
                                                <Link key={album} to={`/album/${album}`}>
                                                    <div className="div">
                                                        <div className='image_holder'>
                                                            <div><BsPlayCircle/></div>
                                                            <img src={albumData.imageSrc}
                                                            onError={(e) => { 
                                                                e.target.onerror = null; 
                                                                e.target.src = '/my_images/placeholders/music/1.jpg' 
                                                            }} />
                                                        </div>
                                                        <h3>{album}</h3>
                                                        <p>{sliceText(albumData.tag.tags.artist, 15)}</p>
                                                    </div>
                                                </Link>
                                            )
                                        }else{
                                            return null
                                        }
                                    })}
                                    {
                                        showLetter 
                                        ?<div className='album-overlay'>
                                            <h1>Group by alphabets</h1>
                                            <div onClick={closeLetterView}>
                                                {
                                                    alphabets.map(alphabet => {
                                                        {
                                                            return(
                                                            albumMap[alphabet].length > 0
                                                                ? <a className='open' href={`#${alphabet}`} onClick={closeAndScrollLetterView}>{alphabet.toUpperCase()}</a>
                                                                : <a className='closed'>{alphabet.toUpperCase()}</a>
                                                            )
                                                        }
                                                    })
                                                }
                                            </div>
                                        </div>
                                        : <div></div>
                                    }
                                </div>
                            </section>
                        )}
                    })
                )
            }
        </div>
    )
}

export default Albums;
