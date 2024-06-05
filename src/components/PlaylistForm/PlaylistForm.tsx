import React, { useContext, useState } from 'react'
import './style.css'
import { PlaylistFormContext } from '../../contexts/PlaylistFormContext'
import { PlaylistContext } from '../../contexts/PlaylistsContext'
import { placeholderSongImages } from '../../assets'
import { ContextMenuContext } from '../../contexts/ContextMenuContext'

const PlaylistForm: React.FC = () => {
    const [playlistName, setPlaylistName] = useState<string>('')
    const {playlistForm, playlistFormDispatch} = useContext(PlaylistFormContext)
    const {playlists, playlistsDispatch} = useContext(PlaylistContext)

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
                            <input value={playlistName} type='text'
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
                            <input value={playlistName} type='text'
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
                        <div className="playlist" onClick={addNew}>
                            <img src={placeholderSongImages[0]}/>
                            <div className="p-info">
                                <h2>New Playlist</h2>
                                <h3></h3>
                            </div>
                        </div>
                        {
                            playlists.map((playlist, index) => (
                                <div className="playlist" key={index} onClick={() => {addToPlaylist(playlist.name)}}>
                                    <img src={playlist.songs.length > 0 ? playlist.songs[0].imageSrc : playlist.defaultImage}/>
                                    <div className="p-info">
                                        <h2>{playlist.name}</h2>
                                        <h3>{playlist.songs.length} songs</h3>
                                    </div>
                                </div>
                            ))
                        }
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
