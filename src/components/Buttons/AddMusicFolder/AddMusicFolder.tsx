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
        await fetchAllSongs()
        if(update){
            update()
        }
    }
    const fetchAllSongs = async () => {
        const musicPath = await window.ipcRenderer.fetchMusicPaths()
        try {
            musicPath.forEach(async data => {
                const allSongs: Array<Song> = await window.ipcRenderer.GetSongs(data.path)
                if (allSongs && allSongs.length > 0)
                    songsDispatch({ type: 'SET_SONGS', payload: allSongs })
            })
            
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
