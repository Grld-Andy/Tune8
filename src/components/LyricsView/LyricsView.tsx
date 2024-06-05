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
            const getSavedLyrics = localStorage.getItem(currentSong.song.tag.tags.title)
            if(getSavedLyrics){
                console.log(getSavedLyrics)
                setLyrics(getSavedLyrics)
                return
            }
            try{
                const response = await fetch(
                    `https://api.lyrics.ovh/v1/${currentSong.song.tag.tags.artist}/${currentSong.song.tag.tags.title.split('|')[0].split('ft')[0]}`
                )
                const data = await response.json();
                if (data.lyrics !== undefined) {
                    let lyricsFileContent:string = data.lyrics;
                    if(!lyricsFileContent){
                        lyricsFileContent = "Not found"
                    }
                    setLyrics(lyricsFileContent)
                    localStorage.setItem(currentSong.song.tag.tags.title, data.lyrics)
                } else {
                    setLyrics("Not found")
                }
            }catch{
                setLyrics("Not found")
            }
        }
    }

    useEffect(() => {
        setLyrics("Searching ...")
        setTimeout(() => {getLyrics()}, 500)
    }, [currentSong])

    return (
    <>
        {
            currentSong.song ?
            <div className={`lyrics-view lyrics-view-${showLyrics}`}>
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
