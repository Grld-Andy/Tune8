import React, { createContext, Dispatch, ReactNode, useReducer } from 'react'
import { PlaylistFormReducer } from '../reducers/PlaylistFormReducer'

interface Props{
    children: ReactNode
}
export interface PlaylistFormState{
    isOpen: boolean,
    payload: string
}
interface PlaylistFormContextType{
    playlistForm: PlaylistFormState,
    playlistFormDispatch: Dispatch<{ type: string, payload: string }>
}
const initialState = {
    isOpen: false,
    payload: ''
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
