import { createContext, ReactNode, useReducer } from "react";
import { currentSongReducer } from "../reducers/CurrentSongReducer";
import { Song } from "../data";

interface Props{
    children: ReactNode
}
export interface CurrentSongState{
    song: Song|null,
    index: number,
    isPlaying?: boolean,
    // audioRef: HTMLAudioElement|null
}
const initialState: CurrentSongState = {
    song: null,
    index: -1,
    isPlaying: false,
    // audioRef: null
}
interface CurrentSongType{
    currentSong: CurrentSongState,
    currentSongDispatch: React.Dispatch<{type: string, payload: Song|null, index: number, isPlaying?: boolean}>
}
export const CurrentSongContext = createContext<CurrentSongType>({
    currentSong: initialState,
    currentSongDispatch: () => null
})

const CurrentSongContextProvider: React.FC<Props> = (props) => {
    const [currentSong, dispatch] = useReducer(currentSongReducer, initialState, () => {
        const lastPlayed = localStorage.getItem('lastPlayed')
        try { 
            return lastPlayed ? JSON.parse(lastPlayed) : initialState 
        }
        catch { return initialState }
    })
    if(currentSong.song)
        // currentSong.audioRef = new Audio(src: currentSong.song.src)

    return(
    <CurrentSongContext.Provider value={{currentSong, currentSongDispatch: dispatch}}>
        {props.children}
    </CurrentSongContext.Provider>
)}

export default CurrentSongContextProvider