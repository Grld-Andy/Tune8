import React from 'react'
import { addMusicFolder } from '../../../utilities'

interface Props{
    text?: string
}

const AddMusicFolderButton: React.FC<Props> = ({text = ''}) => {
    async function addMusicPath() {
        await addMusicFolder()
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
