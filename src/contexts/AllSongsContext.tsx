import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { AllSongsReducer } from "../reducers/AllSongsReducer";
import { currentSongs } from "../assets";
import { Song } from "../data";

interface Props{
    children: ReactNode
}
interface AllSongsContextType{
    songs: Array<Song>|[],
    songsDispatch: Dispatch<{ type: string; payload: Array<Song>|[] }>
}

export const AllSongsContext = createContext<AllSongsContextType>({
    songs: [],
    songsDispatch: () => null
})

const AllSongsContextProvider: React.FC<Props> = (props) => {
    const [songs, songsDispatch] = useReducer(AllSongsReducer, [], () => {
        return currentSongs.length > 0 ? currentSongs : []
    })

  return (
    <AllSongsContext.Provider value={{songs, songsDispatch}}>
        {props.children}
    </AllSongsContext.Provider>
  )
}

export default AllSongsContextProvider
