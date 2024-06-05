import React, { createContext, Dispatch, ReactNode, useReducer } from 'react'
import { PlaylistFormReducer } from '../reducers/PlaylistFormReducer'

interface Props{
    children: ReactNode
}
interface PlaylistFormContextType{
    playlistForm: {isOpen: boolean},
    playlistFormDispatch: Dispatch<{ type: string }>
}
const initialState = {
    isOpen: false
}

export const PlaylistFormContext = createContext<PlaylistFormContextType>({
    playlistForm: initialState,
    playlistFormDispatch: () => null
})

const PlaylistFormContextProvider: React.FC <Props> = (props) => {
    const [playlistForm, playlistFormDispatch] = useReducer(PlaylistFormReducer, initialState)

  return (
    <PlaylistFormContext.Provider value={{playlistForm, playlistFormDispatch}}>
        {props.children}
    </PlaylistFormContext.Provider>
  )
}

export default PlaylistFormContextProvider
