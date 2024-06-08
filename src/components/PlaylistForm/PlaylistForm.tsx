import React, { useContext, useEffect, useRef, useState } from 'react'
import './style.css'
import { PlaylistFormContext } from '../../contexts/PlaylistFormContext'
import { PlaylistContext } from '../../contexts/PlaylistsContext'
import { placeholderSongImages } from '../../assets'
import { ContextMenuContext } from '../../contexts/ContextMenuContext'

const PlaylistForm: React.FC = () => {
    const [playlistName, setPlaylistName] = useState<string>('')
    const {playlistForm, playlistFormDispatch} = useContext(PlaylistFormContext)
    const {playlists, playlistsDispatch} = useContext(PlaylistContext)
    const inputRef = useRef<HTMLInputElement|null>(null)

    const handlePlaylistName = (val: string) => {
        setPlaylistName(val)
    }
    const closeForm = () => {
        playlistFormDispatch({type: 'CLOSE_FORM', payload: ''})
    }
    const handlePlaylistInteract = (val: string) => {
        if(playlistName){
            if(val === 'submit'){
                playlistsDispatch({ type: 'CREATE_PLAYLIST', payload: {name:playlistName, songs: []} })
                setPlaylistName('')
            }
        }
        closeForm()
    }
    const addNew = () => {
        playlistFormDispatch({type: 'OPEN_FORM', payload: 'create'})
    }

    // add to existing playlist
    const {contextMenu} = useContext(ContextMenuContext)
    const addToPlaylist = (name: string) => {
        playlistsDispatch({ type: 'ADD_TO_PLAYLIST', payload: {name:name, songs: contextMenu.lastClicked} })
        closeForm()
    }

    // focus on input
    useEffect(() => {
        if(inputRef.current){
            inputRef.current.focus()
        }
    }, [playlistForm.isOpen])
    
    return (
        <>
        {
            playlistForm.isOpen &&
            <>
            {
                playlistForm.payload === 'create'?
                <div className='playlistForm'>
                    <div className="container">
                        <h1>Add to playlist</h1>
                        <form onSubmit={() => {handlePlaylistInteract('submit')}}>
                            <input ref={inputRef} value={playlistName} type='text'
                            placeholder='Playlist name' onChange={(e) => {handlePlaylistName(e.target.value)}}/>
                            <div className="buttons">
                                <button type='submit' onClick={() => {handlePlaylistInteract('submit')}}>Submit</button>
                                <button onClick={() => {handlePlaylistInteract('')}}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>:
                playlistForm.payload === 'edit'?
                <div className='playlistForm'>
                    <div className="container">
                        <h1>Edit to playlist</h1>
                        <form onSubmit={() => {handlePlaylistInteract('submit')}}>
                            <input ref={inputRef} value={playlistName} type='text'
                            placeholder='Playlist name' onChange={(e) => {handlePlaylistName(e.target.value)}}/>
                            <div className="buttons">
                                <button type='submit' onClick={() => {handlePlaylistInteract('edit')}}>Save</button>
                                <button onClick={closeForm}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>:
                playlistForm.payload === 'add'?
                <div className='playlistForm'>
                    <div className="container">
                        <h1>Add to playlist</h1>
                        <div className="all-playlists">
                            <div className="playlist" onClick={addNew}>
                                <img src={placeholderSongImages[0]}/>
                                <div className="p-info">
                                    <h4>New Playlist</h4>
                                    <h5></h5>
                                </div>
                            </div>
                            {
                                playlists.map((playlist, index) => (
                                    <div className="playlist" key={index} onClick={() => {addToPlaylist(playlist.name)}}>
                                        <img src={playlist.songs.length > 0 ? playlist.songs[0].imageSrc : playlist.defaultImage}/>
                                        <div className="p-info">
                                            <h4>{playlist.name}</h4>
                                            <h5>{playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}</h5>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="buttons">
                            <button onClick={closeForm}>Cancel</button>
                        </div>
                    </div>
                </div>:
                <></>
            }
            </>
        }
        </>
    )
}

export default PlaylistForm
