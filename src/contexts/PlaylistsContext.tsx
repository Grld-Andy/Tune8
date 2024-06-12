import React, { createContext, ReactNode, useReducer } from "react";
import { PlaylistReducer } from "../reducers/PlaylistReducer";
import { PlaylistInterface, Song } from "../data";

interface Props{
    children: ReactNode
}
interface PlaylistContextType{
    playlists: Array<PlaylistInterface> | [],
    playlistsDispatch: React.Dispatch<{
        type: string;payload: PlaylistInterface;
        songs?: Array<Song>; playlistName?: string;
        newName?: string
    }>
}

export const PlaylistContext = createContext<PlaylistContextType>({
    playlists: [],
    playlistsDispatch: () => null
})

const PlaylistsContextProvider: React.FC<Props> = (props) => {
    const [playlists, playlistsDispatch] = useReducer(PlaylistReducer, [])

    return (
        <PlaylistContext.Provider value={{playlists, playlistsDispatch}}>
            {props.children}
        </PlaylistContext.Provider>
    )
}

export default PlaylistsContextProvider
