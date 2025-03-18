import React, { useContext, useEffect, useState } from 'react'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import './style.css'

interface Props{
    showLyrics: boolean
}

const LyricsView: React.FC<Props> = ({showLyrics}) => {
    const {currentSong} = useContext(CurrentSongContext)
    const [lyrics, setLyrics] = useState<string>('')
    
    const getLyrics = async() => {
        if(currentSong.song){
            console.log('start')
            let getSavedLyrics = localStorage.getItem(currentSong.song.tag.tags.title)
            if(getSavedLyrics){
                getSavedLyrics = getSavedLyrics.replace(/\n/g, '</br>')
                setLyrics(getSavedLyrics)
                return
            }
            try{
                console.log('continue')
                const response = await fetch(
                    `https://api.lyrics.ovh/v1/${currentSong.song.tag.tags.artist}/${currentSong.song.tag.tags.title.split('|')[0].split('ft')[0]}`
                )
                const data = await response.json();
                if (data.lyrics !== undefined) {
                    let lyricsFileContent:string = data.lyrics;
                    if(!lyricsFileContent){
                        lyricsFileContent = currentSong.song.lyrics
                    }
                    setLyrics(lyricsFileContent)
                    localStorage.setItem(currentSong.song.tag.tags.title, data.lyrics)
                } else {
                    console.log('last')
                    const songLyrics = currentSong.song.lyrics.replace(/\n/g, '</br>')
                    setLyrics(songLyrics)
                }
            }catch{
                setLyrics(currentSong.song.lyrics)
            }
        }
    }

    useEffect(() => {
        setLyrics("Searching ...")
        setTimeout(() => {getLyrics()}, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSong.song])

    return (
    <>
        {
            currentSong.song ?
            <div className={`lyrics-view-${showLyrics} lyrics-view `}>
                <div className="info">
                    <img src={currentSong.song?.imageSrc} />
                </div>
                <div className="lyrics">
                    <p dangerouslySetInnerHTML={{ __html: lyrics }} />
                </div>
            </div>
        : <></>
        }
    </>
  )
}

export default LyricsView
