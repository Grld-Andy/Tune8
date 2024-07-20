import React, { createContext, Dispatch, useReducer } from "react";
import { Song } from "../data";
import { SongFormReducer } from "../reducers/SongFormReducer";

interface Props{
    children: React.ReactNode
}

export interface SongFormState{
    isOpen: string,
    song: Song|null
}
interface SongFormType{
    songForm: SongFormState,
    songFormDispatch: Dispatch<{type: string, payload: Song|null}>
}
export const SongFormContext = createContext<SongFormType>({
    songForm: {isOpen: '', song: null},
    songFormDispatch: () => null
})

const SongFormContextProvider: React.FC<Props> = ({children}) => {
    const [songForm, songFormDispatch] = useReducer(SongFormReducer, {isOpen: '', song: null})
  return (
    <SongFormContext.Provider value={{songForm, songFormDispatch}}>
      {children}
    </SongFormContext.Provider>
  )
}

export default SongFormContextProvider