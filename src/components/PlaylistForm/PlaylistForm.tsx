import React, { useContext, useEffect, useRef, useState } from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom'
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

    // handle creation and editing of playlist
    const navigate = useNavigate()
    const handlePlaylistInteract = async (val: string) => {
        const playlist = playlists.find(val => val.name === playlistForm.name)
        if(playlistName){
            if(val === 'submit'){
                const defaultImage = placeholderSongImages[Math.floor(Math.random() * 4)]
                const playlistId = await window.ipcRenderer.createPlaylist(playlistName, defaultImage)
                playlistsDispatch({ type: 'CREATE_PLAYLIST', payload: {id: playlistId,name:playlistName, songs: []} })
                setPlaylistName('')
            }
            if(val === 'edit' && playlistForm.name){
                if(!playlist){
                    closeForm()
                    return
                }
                await window.ipcRenderer.updatePlaylist(playlist.id, playlistName)
                playlistsDispatch({type: 'EDIT_PLAYLIST', payload: {id: playlist.id,name: playlistForm.name, songs: []}, newName: playlistName})
                navigate(`/playlistView/${playlistName}`)
                setPlaylistName('')
            }
        }
        closeForm()
    }
    const addNew = () => {
        playlistFormDispatch({type: 'OPEN_FORM', payload: 'create'})
    }

    // add to existing playlist
    const { contextMenu } = useContext(ContextMenuContext)
    const addToPlaylist = async (name: string) => {
        const playlist = playlists.find(val => val.name === playlistName)
        if(playlist){
            await Promise.all(contextMenu.lastClicked.map(song => window.ipcRenderer.addSongToPlaylist(song.id, playlist.id)))
            playlistsDispatch({ type: 'ADD_TO_PLAYLIST', payload: {id: 0,name:name, songs: contextMenu.lastClicked} })
        }
        closeForm()
    }

    // edit existing playlist name on render
    useEffect(() => {
        if(playlistForm.payload === 'edit' && playlistForm.name){
            setPlaylistName(playlistForm.name)
        }
    }, [playlistForm.name, playlistForm.payload])

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
                        <form onSubmit={(e) => {
                        e.preventDefault()
                        handlePlaylistInteract('submit')
                        }}>
                            <input ref={inputRef} value={playlistName} type='text'
                            placeholder='Playlist name' onChange={(e) => {handlePlaylistName(e.target.value)}}/>
                            <div className="buttons">
                                <button type='submit'>Submit</button>
                                <button onClick={() => {handlePlaylistInteract('')}}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>:
                playlistForm.payload === 'edit'?
                <div className='playlistForm'>
                    <div className="container">
                        <h1>Edit Name</h1>
                        <form onSubmit={(e) => {
                        e.preventDefault()
                        handlePlaylistInteract('edit')
                        }}>
                            <input ref={inputRef} value={playlistName} type='text'
                            placeholder='Playlist name' onChange={(e) => {handlePlaylistName(e.target.value)}}/>
                            <div className="buttons">
                                <button type='submit'>Save</button>
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
                                            <h5>{playlist.songs.length} songs</h5>
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
