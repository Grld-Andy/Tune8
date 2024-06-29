import { createContext, Dispatch, ReactNode, useContext, useEffect, useReducer } from "react"
import { AllSongsReducer } from "../reducers/AllSongsReducer"
import { Song } from "../data"
import { FeedbackContext } from "./FeedbackContext"

interface Props {
    children: ReactNode
}

interface AllSongsContextType {
    songs: Array<Song> | []
    songsDispatch: Dispatch<{ type: string; payload: Array<Song> | [], path?: string }>
}

export const AllSongsContext = createContext<AllSongsContextType>({
    songs: [],
    songsDispatch: () => null
})

const AllSongsContextProvider: React.FC<Props> = (props) => {
    const [songs, songsDispatch] = useReducer(AllSongsReducer, [])
    const {feedbackDispatch} = useContext(FeedbackContext)

    useEffect(() => {
        const fetchAllSongs = async () => {
            try {
                const allSongs: Array<Song> = await window.ipcRenderer.GetSongs()
                if (allSongs && allSongs.length > 0){
                    songsDispatch({ type: 'SET_SONGS', payload: allSongs })
                    feedbackDispatch({type: 'CLOSE_LOADER', payload:{text: '', view: 'close_loader'}})
                }
            } catch (error) {
                console.error("Error fetching songs:", error)
            }
        }

        feedbackDispatch({type: 'LOADER', payload:{text: 'Indexing songs', view: 'loader'}})
        fetchAllSongs()
    }, [feedbackDispatch])

    return (
        <AllSongsContext.Provider value={{ songs, songsDispatch }}>
            {props.children}
        </AllSongsContext.Provider>
    )
}

export default AllSongsContextProvider
