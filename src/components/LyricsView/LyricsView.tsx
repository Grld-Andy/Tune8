import React, { useContext, useEffect, useState } from 'react'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import './style.css'

interface Props{
    showLyrics: boolean
}

const LyricsView: React.FC<Props> = ({showLyrics}) => {
    const {currentSong} = useContext(CurrentSongContext)
    const [lyrics, setLyrics] = useState<string>('')
    
    const getLyrics = async () => {
        if (currentSong.song) {
            try {
                const getSavedLyrics = await window.ipcRenderer.getLyricsFromDatabase(currentSong.song.id)
                if (getSavedLyrics) {
                    setLyrics(getSavedLyrics)
                    return
                }
                
                const response = await fetch(
                    `https://api.lyrics.ovh/v1/${currentSong.song.tag.tags.artist}/${currentSong.song.tag.tags.title.split('|')[0].split('ft')[0]}`
                )
                const data = await response.json()
                
                if (data.lyrics !== undefined) {
                    let lyricsFileContent: string = data.lyrics.replace(/\n/g, '<div></div>')
                    if (!lyricsFileContent) {
                    lyricsFileContent = "Not found"
                    }
                    setLyrics(lyricsFileContent)
                    window.ipcRenderer.saveLyricsToDatabase({ lyric: lyricsFileContent, song_id: currentSong.song.id })
                } else {
                    setLyrics("Not found")
                }
            } catch (error) {
                console.error("Error fetching lyrics:", error)
                setLyrics("Not found")
            }
        }
    }

    useEffect(() => {
        setLyrics("Searching ...")
        setTimeout(() => {getLyrics()}, 300)
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
