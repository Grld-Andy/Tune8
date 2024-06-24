import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from "react";
import { favoritesReducer } from "../reducers/FavoritesReducer";
import { Song } from "../data";
import { AllSongsContext } from "./AllSongsContext";

// Props interface
interface Props{
    children: ReactNode
}
// favoritesContext interface
// defines datatypes of state and dispatch
interface FavoritesContextType{
    favorites: Array<Song>|[],
    favoritesDispatch: Dispatch<{ type: string; payload: Array<Song>|[] }>
}

// createContext with inital state parameters
export const FavoritesContext = createContext<FavoritesContextType>({
    favorites: [],
    favoritesDispatch: () => null
})

export const FavoritesContextProvider: React.FC<Props> = (props) => {
  const { songs } = useContext(AllSongsContext)

  const [favorites, favoritesDispatch] = useReducer(favoritesReducer, [], () => {
    return songs.filter(song => song.isFavorite)
  })

  return (
    <FavoritesContext.Provider value={{favorites, favoritesDispatch}}>
      {props.children}
    </FavoritesContext.Provider>
  )
}

export default FavoritesContext

