import React, { useContext } from 'react'
import { addMusicFolder } from '../../../utilities'
import { AllSongsContext } from '../../../contexts/AllSongsContext'
import { Song } from '../../../data'

interface Props{
    text?: string
}

const AddMusicFolderButton: React.FC<Props> = ({text = ''}) => {
    const { songsDispatch} = useContext(AllSongsContext)
    async function addMusicPath() {
        await addMusicFolder()
        await fetchAllSongs()
    }
    const fetchAllSongs = async () => {
        const musicPath:Array<string> = JSON.parse(localStorage.getItem("MusicPaths") ?? '[]')
        try {
            musicPath.forEach(async path => {
                const allSongs: Array<Song> = await window.ipcRenderer.GetSongs(path)
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
