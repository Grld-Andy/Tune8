import { createContext, Dispatch, ReactNode, useReducer } from "react"
import { AllSongsReducer } from "../reducers/AllSongsReducer"
import { Song } from "../data"
import { currentSongs } from "../assets"

interface Props {
    children: ReactNode
}

interface AllSongsContextType {
    songs: Array<Song> | []
    songsDispatch: Dispatch<{ type: string; payload: Array<Song> | [] }>
}

export const AllSongsContext = createContext<AllSongsContextType>({
    songs: [],
    songsDispatch: () => null
})

const AllSongsContextProvider: React.FC<Props> = ({ children }) => {
    const [songs, songsDispatch] = useReducer(AllSongsReducer, [], () => {
        return currentSongs
    })

    return (
        <AllSongsContext.Provider value={{ songs, songsDispatch }}>
            {children}
        </AllSongsContext.Provider>
    )
}

export default AllSongsContextProvider
