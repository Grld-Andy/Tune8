import React, { useContext } from 'react'
import { CurrentSongContext } from '../../contexts/CurrentSongContext'
import './style.css'

interface Props{
    showLyrics: boolean
}

const LyricsView: React.FC<Props> = ({showLyrics}) => {
    const {currentSong} = useContext(CurrentSongContext)

    return (
    <>
        {
            currentSong.song ?
            <div className={`lyrics-view lyrics-view-${showLyrics}`}>
                <div className="info">
                    <img src={currentSong.song?.imageSrc} />
                </div>
                <div className="lyrics">
                    <p>
                        [Neffex]<br/><br/>
                        Lorem ipsum dolor, sit amet consectetur
                        adipisicing elit.<br/> Voluptas sit obcaecati
                        consectetur, placeat enim ab id illum
                        molestiae.<br/><br/> Illo ipsam eius facilis quas,
                        error recusandae similique nam dignissimos
                        magni velit non ut soluta, qui aut quos.<br/><br/>
                        Saepe, aliquam hic? Iusto.<br/>
                    </p>
                </div>
            </div>
        : <></>
        }
        
    </>
  )
}

export default LyricsView
