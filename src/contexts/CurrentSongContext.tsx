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
    currentSongDispatch: React.Dispatch<{ type: string, payload: Song | null, index: number, isPlaying?: boolean, audioRef?: HTMLAudioElement | null, reset?: boolean }>
}

export const CurrentSongContext = createContext<CurrentSongType>({
    currentSong: initialState,
    currentSongDispatch: () => null
})

const CurrentSongContextProvider: React.FC<Props> = (props) => {
    const [currentSong, dispatch] = useReducer(currentSongReducer, initialState)

    useEffect(() => {
        const getLastPlayed = async() => {
            return await window.ipcRenderer.getLastPlayedSong()
        }
        getLastPlayed()
        .then(res => {
            dispatch({ type: 'SET_CURRENT_SONG', payload: res.song, index: res.index, isPlaying: res.isPlaying, audioRef: res.audioRef })
        })
    }, [])

    return (
        <CurrentSongContext.Provider value={{ currentSong, currentSongDispatch: dispatch }}>
            {props.children}
        </CurrentSongContext.Provider>
    )
}

export default CurrentSongContextProvider;
