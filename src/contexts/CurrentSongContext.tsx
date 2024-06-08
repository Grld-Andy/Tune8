import { createContext, ReactNode, useReducer } from "react";
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
    const [currentSong, dispatch] = useReducer(currentSongReducer, initialState, () => {
        const lastPlayed = localStorage.getItem('lastPlayed')
        try {
            const parsed = lastPlayed ? JSON.parse(lastPlayed) : initialState;
            return { ...parsed, audioRef: parsed.song ? new Audio(parsed.song.src) : null };
        } catch {
            return initialState;
        }
    });

    return (
        <CurrentSongContext.Provider value={{ currentSong, currentSongDispatch: dispatch }}>
            {props.children}
        </CurrentSongContext.Provider>
    )
}

export default CurrentSongContextProvider;
