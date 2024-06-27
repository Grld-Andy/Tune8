import { createContext, ReactNode, useEffect, useReducer } from "react";
import { currentSongReducer } from "../reducers/CurrentSongReducer";
import { Song } from "../data";
interface Props {
    children: ReactNode
}

export interface CurrentSongState {
    song: Song | null;
    index: number;
    isPlaying?: boolean;
    audioRef?: HTMLAudioElement | null;
}

const initialState: CurrentSongState = {
    song: null,
    index: -1,
    isPlaying: false,
    audioRef: null
}

interface CurrentSongType {
    currentSong: CurrentSongState,
    currentSongDispatch: React.Dispatch<{ type: string, payload: Song | null, index: number, isPlaying?: boolean, audioRef?: HTMLAudioElement | null, currentSonget?: boolean }>
}

export const CurrentSongContext = createContext<CurrentSongType>({
    currentSong: initialState,
    currentSongDispatch: () => null
})

const CurrentSongContextProvider: React.FC<Props> = (props) => {
    const [currentSong, dispatch] = useReducer(currentSongReducer, initialState)

    useEffect(() => {
        const getLastPlayed = async() => {
            const lastSong: {song: Song, queue_no: number} = await window.ipcRenderer.getLastPlayedSong()
            const songAudio = new Audio()
            songAudio.src = lastSong.song.src
            console.log(lastSong)
            dispatch({ type: 'SET_CURRENT_SONG', payload: lastSong.song, index: lastSong.queue_no, isPlaying: false, audioRef: songAudio })
        }
        getLastPlayed()
    }, [])

    return (
        <CurrentSongContext.Provider value={{ currentSong, currentSongDispatch: dispatch }}>
            {props.children}
        </CurrentSongContext.Provider>
    )
}

export default CurrentSongContextProvider;
