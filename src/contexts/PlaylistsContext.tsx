import React, { createContext, ReactNode, useReducer } from "react";
import { PlaylistReducer } from "../reducers/PlaylistReducer";
import { PlaylistInterface, Song } from "../data";
import { currentPlaylists } from "../assets";

interface Props{
    children: ReactNode
}
interface PlaylistContextType{
    playlists: Array<PlaylistInterface> | [],
    playlistsDispatch: React.Dispatch<{
        type: string;payload: PlaylistInterface;
        song?: Song; playlistName?: string
    }>
}

export const PlaylistContext = createContext<PlaylistContextType>({
    playlists: [],
    playlistsDispatch: () => null
})

const PlaylistsContextProvider: React.FC<Props> = (props) => {
    const [playlists, playlistsDispatch] = useReducer(PlaylistReducer, [], () => {
        return currentPlaylists
    })

    return (
        <PlaylistContext.Provider value={{playlists, playlistsDispatch}}>
            {props.children}
        </PlaylistContext.Provider>
    )
}

export default PlaylistsContextProvider
