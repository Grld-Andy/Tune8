import { createContext, ReactNode, useReducer } from "react";
import { currentSongReducer } from "../reducers/CurrentSongReducer";
import { Song } from "../data";

interface Props{
    children: ReactNode
}
interface CurrentSongType{
    currentSong: Song | null,
    dispatch: React.Dispatch<{type: string, payload: Song|null}>
}
export const CurrentSongContext = createContext<CurrentSongType>({
    currentSong: null,
    dispatch: () => null
})

const CurrentSongContextProvider: React.FC<Props> = (props) => {
    const [currentSong, dispatch] = useReducer(currentSongReducer, null, () => {
        const lastPlayed = localStorage.getItem('lastPlayed')
        try { return lastPlayed ? JSON.parse(lastPlayed) : null }
        catch { return null }
    })
    console.log('current song', currentSong)

    return(
    <CurrentSongContext.Provider value={{currentSong, dispatch}}>
        {props.children}
    </CurrentSongContext.Provider>
)}

export default CurrentSongContextProvider