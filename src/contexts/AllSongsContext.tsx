import { createContext, Dispatch, ReactNode, useEffect, useReducer } from "react"
import { AllSongsReducer } from "../reducers/AllSongsReducer"
import { Song } from "../data"

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

const AllSongsContextProvider: React.FC<Props> = (props) => {
    const [songs, songsDispatch] = useReducer(AllSongsReducer, [])

    useEffect(() => {
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

        fetchAllSongs()
    }, [])

    return (
        <AllSongsContext.Provider value={{ songs, songsDispatch }}>
            {props.children}
        </AllSongsContext.Provider>
    )
}

export default AllSongsContextProvider
