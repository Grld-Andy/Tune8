import { createContext, Dispatch, ReactNode, useReducer } from "react";
import React from 'react'
import { SearchReducer } from "../reducers/SearchReducer";

interface Props{
    children: ReactNode
}
interface SearchContextType{
    search: string
    searchDispatch: Dispatch<{ type: string; payload: string; }>
} 
export const SearchContext = createContext<SearchContextType>({
    search: '',
    searchDispatch: () => null
})


const SearchContextProvider: React.FC<Props> = (props) => {
    const [search, searchDispatch] = useReducer(SearchReducer, '')

  return (
    <SearchContext.Provider value={{search, searchDispatch}}>
        {props.children}
    </SearchContext.Provider>
  )
}

export default SearchContextProvider
