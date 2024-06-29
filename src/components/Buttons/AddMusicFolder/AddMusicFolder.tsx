import React, { useContext } from 'react'
import { addMusicFolder } from '../../../utilities'
import { AllSongsContext } from '../../../contexts/AllSongsContext'
import { Song } from '../../../data'

interface Props{
    text?: string,
    update?: () => void
}

const AddMusicFolderButton: React.FC<Props> = ({text = '', update}) => {
    const { songsDispatch} = useContext(AllSongsContext)
    async function addMusicPath() {
        await addMusicFolder()
        setTimeout(async() => {
            await fetchAllSongs()
        }, 500)
        if(update){
            update()
        }
    }
    const fetchAllSongs = async () => {
        try {
            const allSongs: Array<Song> = await window.ipcRenderer.GetSongs()
            if (allSongs && allSongs.length > 0)
                songsDispatch({ type: 'SET_SONGS', payload: allSongs })
        } catch (error) {
            console.error("Error fetching songs:", error)
        }
    }
    
    return (
        <button onClick={addMusicPath}>
            {
                text? text : 'Add Folder'
            }
        </button>
    )
}

export default AddMusicFolderButton
