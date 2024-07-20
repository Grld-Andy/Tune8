import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { SongFormContext } from '../../contexts/SongFormContext'
import './style.css'
import { Song } from '../../data'
import { AllSongsContext } from '../../contexts/AllSongsContext'
import { QueueSongsContext } from '../../contexts/QueueSongsContext'
import FavoritesContext from '../../contexts/FavoritesContext'

const FileEditForm: React.FC = () => {
    const {songForm, songFormDispatch} = useContext(SongFormContext)

    // close modal
    const closeModal = () => {
        songFormDispatch({type: 'CLOSE_MODAL', payload: null})
    }

    // form editing funtionality
    const [songTitle, setSongTitle] = useState<string>('')
    const [songAlbum, setSongAlbum] = useState<string>('')
    const [songArtist, setSongArtist] = useState<string>('')
    const [songYear, setSongYear] = useState<number>(0)
    const [songGenre, setSongGenre] = useState<string>('')
    useEffect(() => {
        if(songForm.song){
            setSongTitle(songForm.song.tag.tags.title)
            setSongAlbum(songForm.song.tag.tags.album)
            setSongArtist(songForm.song.tag.tags.artist)
            setSongGenre(songForm.song.tag.tags.genre)
            setSongYear(songForm.song.tag.tags.year)
        }
    }, [songForm])

    // update song onsubmit
    const {songsDispatch} = useContext(AllSongsContext)
    const {dispatch} = useContext(QueueSongsContext)
    const {favoritesDispatch} = useContext(FavoritesContext)
    const updateSong = async (e: FormEvent) => {
        e.preventDefault()
        if(songForm.song){
            const songToUpdate:Song = {...songForm.song,
                tag: {
                    tags: {
                        title: songTitle,
                        album: songAlbum,
                        artist: songArtist,
                        genre: songGenre,
                        year: songYear
                    }
                }
            }
            window.ipcRenderer.updateSongDatabase(songToUpdate)
                .then(res => {
                    if(res === 'Successful'){
                        songsDispatch({type:"UPDATE_SONG", payload: [songToUpdate]})
                        dispatch({type:"UPDATE_QUEUE", payload: [songToUpdate], index: 0})
                        favoritesDispatch({type:"UPDATE_FAVORITES", payload: [songToUpdate]})
                        closeModal()
                    }
                })
        }
    }

  return (
    <>
    {
        songForm.isOpen == 'details' && songForm.song ?
        <div className="song-details">
            <div className='song-form-overlay' onClick={closeModal}></div>
            <div className="details-container">
                <h1>Song Details</h1>
                <div className="main-info">
                    <div className="tile">
                        <h3>Title</h3>
                        <h4>{songForm.song.tag.tags.title}</h4>
                    </div>
                    <div className="tile">
                        <h3>Album</h3>
                        <h4>{songForm.song.tag.tags.album}</h4>
                    </div>
                    <div className="tile">
                        <h3>Artist</h3>
                        <h4>{songForm.song.tag.tags.artist}</h4>
                    </div>
                    <div className="tile">
                        <h3>Year Released</h3>
                        <h4>{songForm.song.tag.tags.year}</h4>
                    </div>
                    <div className="tile">
                        <h3>Song Duration</h3>
                        <h4>{songForm.song.duration}</h4>
                    </div>
                    <div className="tile">
                        <h3>Genre</h3>
                        <h4>{songForm.song.tag.tags.genre}</h4>
                    </div>
                </div>
                <div className="source">
                    <h2>{songForm.song.src}</h2>
                </div>
            </div>
        </div>:
        songForm.isOpen == 'form' && songForm.song ?
        <div className="song-details">
            <div className='song-form-overlay' onClick={closeModal}></div>
            <div className="details-container">
                <h1>Edit Song</h1>
                <form onSubmit={updateSong}>
                    <div className="main-info">
                        <div className="tile">
                            <h3>Title</h3>
                            <input onChange={(e) => {setSongTitle(e.target.value)}} value={songTitle} required/>
                        </div>
                        <div className="tile">
                            <h3>Album</h3>
                            <input onChange={(e) => {setSongAlbum(e.target.value)}} value={songAlbum} required/>
                        </div>
                        <div className="tile">
                            <h3>Artist</h3>
                            <input onChange={(e) => {setSongArtist(e.target.value)}} value={songArtist} required/>
                        </div>
                        <div className="tile">
                            <h3>Year Released</h3><input onChange={(e) => {setSongYear(Number(e.target.value))}} value={songYear} required/>
                        </div>
                        <div className="tile">
                            <h3>Genre</h3>
                            <input onChange={(e) => {setSongGenre(e.target.value)}} value={songGenre} required/>
                        </div>
                    </div>
                    <div className="source">
                        <div className="form-buttons">
                            <button type='submit'>Submit</button>
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>:
        null
    }
    </>
  )
}

export default FileEditForm
