import { createContext, ReactNode, useReducer } from "react";
import { currentSongReducer } from "../reducers/CurrentSongReducer";
import { Song } from "../data";

interface Props{
    children: ReactNode
}
interface CurrentSongType{
    currentSong: Song | null,
    currentSongDispatch: React.Dispatch<{type: string, payload: Song|null}>
}
export const CurrentSongContext = createContext<CurrentSongType>({
    currentSong: null,
    currentSongDispatch: () => null
})

const CurrentSongContextProvider: React.FC<Props> = (props) => {
    const [currentSong, dispatch] = useReducer(currentSongReducer, null, () => {
        const lastPlayed = localStorage.getItem('lastPlayed')
        try { return lastPlayed ? JSON.parse(lastPlayed) : null }
        catch { return null }
    })

    return(
    <CurrentSongContext.Provider value={{currentSong, currentSongDispatch: dispatch}}>
        {props.children}
    </CurrentSongContext.Provider>
)}

export default CurrentSongContextProvider