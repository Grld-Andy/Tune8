import React, { useState, useMemo } from 'react';
import { alphabets } from '../../constants';
import { Link } from 'react-router-dom';
import './Artists.css'

let uniqueArtists;


const Artists = ({allSongs}) => {
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

    const artistMap = useMemo(() => {
            return alphabets.reduce((acc, alphabet) => {
            const artists = allSongs.filter(song => song.tag.tags.artist.toLowerCase().startsWith(alphabet.toLowerCase()));
            uniqueArtists = [...new Set(artists.map(song => song.tag.tags.artist.trim().split(',')[0].split('&')[0].split('ft.')[0].split('feat.')[0].split('Ft.')[0].split('Feat.')[0]))];
            acc[alphabet] = uniqueArtists;
            return acc;
        }, {});
    }, [allSongs]);


    return (
        <div className="artists-window">
            <nav>
                <h1>Artists</h1>
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
                :(alphabets.map(alphabet => {
                    const uniqueArtists = artistMap[alphabet] || []
                    if (uniqueArtists.length > 0) {
                        return (
                            <section id={alphabet} key={alphabet}>
                                <h1 onClick={closeLetterView}>{alphabet.toUpperCase()}</h1>
                                <div className="artist-flex">
                                    {uniqueArtists.map(artist => {
                                        const artistData = allSongs.find(song => song.tag.tags.artist.toLowerCase() === artist.toLowerCase())
                                        if(artistData){
                                            return (
                                                <Link key={artist} to={`/artist/${artist}`}>
                                                    <div className='div'>
                                                        <div>
                                                            <img src={artistData.imageSrc} alt={artist} loading='lazy'
                                                                onError={(e) => { 
                                                                    e.target.onerror = null; 
                                                                    e.target.src = '/my_images/placeholders/music/1.jpg' 
                                                                }}
                                                            />
                                                        </div>
                                                        <h3>{artist}</h3>
                                                    </div>
                                                </Link>
                                            )
                                        }else{
                                            return null
                                        }
                                    })}
                                </div>
                            </section>
                        );
                    } else {
                        return null;
                    }
                })
                )
            }
            
            {
                showLetter 
                ?<div className='artist-overlay'>
                    <h1>Group by alphabets</h1>
                    <div onClick={closeLetterView}>
                        {
                            alphabets.map(alphabet => {
                                {
                                    return(
                                    artistMap[alphabet].length > 0
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
    )
}

export default Artists;
