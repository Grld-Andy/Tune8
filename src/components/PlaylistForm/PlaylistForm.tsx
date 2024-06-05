import React, { useContext, useState } from 'react'
import './style.css'
import { PlaylistFormContext } from '../../contexts/PlaylistFormContext'
import { PlaylistContext } from '../../contexts/PlaylistsContext'

const PlaylistForm: React.FC = () => {
    const [playlistName, setPlaylistName] = useState<string>('')
    const {playlistForm, playlistFormDispatch} = useContext(PlaylistFormContext)
    const {playlistsDispatch} = useContext(PlaylistContext)

    const handlePlaylistName = (val: string) => {
        setPlaylistName(val)
    }
    const handlePlaylistInteract = (val: string) => {
        if(playlistName){
            if(val === 'submit'){
                playlistsDispatch({ type: 'CREATE_PLAYLIST', payload: {name:playlistName, songs: []} })
            }
        }
        playlistFormDispatch({type: 'CLOSE_FORM'})
        
    }
    
    return (
        <>
        {
            playlistForm.isOpen &&
            <div className='playlistForm'>
                <div className="container">
                    <h1>Add to playlist</h1>
                    <input value={playlistName} type='text'
                    placeholder='Playlist name' onChange={(e) => {handlePlaylistName(e.target.value)}}/>
                    <div className="buttons">
                        <button onClick={() => {handlePlaylistInteract('submit')}}>Submit</button>
                        <button onClick={() => {handlePlaylistInteract('')}}>Cancel</button>
                    </div>
                </div>
            </div>
        }
        </>
    )
}

export default PlaylistForm
