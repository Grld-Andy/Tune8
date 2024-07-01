import React, { useContext } from 'react'
import { addMusicFolder } from '../../../utilities'
import { AllSongsContext } from '../../../contexts/AllSongsContext'
import { FeedbackContext } from '../../../contexts/FeedbackContext'

interface Props{
    text?: string,
    update?: () => void // Updates musicPaths in settings page ( View Settings.jsx > updatePaths() )
}

const AddMusicFolderButton: React.FC<Props> = ({text = '', update}) => {
    const { songsDispatch} = useContext(AllSongsContext)
    const {feedbackDispatch} = useContext(FeedbackContext)
    
    async function addMusicPath() {
        feedbackDispatch({type: 'LOADER', payload:{text: 'Adding Songs', view: 'loader'}})
        await addMusicFolder().then(async() => {
            await fetchAllSongs().then(() => {
                feedbackDispatch({type: 'CLOSE_LOADER', payload:{text: '', view: 'close_loader'}})
            })
        })
        if(update){
            update()
        }
    }
    const fetchAllSongs = async () => {
        try {
            await window.ipcRenderer.GetSongs().then((allSongs) => {
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
