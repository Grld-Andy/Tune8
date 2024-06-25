import { createContext, Dispatch, ReactNode, useEffect, useReducer } from "react";
import { themeReducer } from "../reducers/ThemeReducer";

interface ThemeContextType {
    theme: string
    themeDispatch: Dispatch<{ type: string }>
}
interface Props {
    children: ReactNode
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    themeDispatch: () => null
})

const ThemeContextProvider: React.FC<Props> = (props) => {
    const [theme, themeDispatch]: [string, Dispatch<{ type: string; }>] = useReducer(themeReducer, 'dark', () => {
        const localTheme: string|null = localStorage.getItem('theme')
        return localTheme ? localTheme : 'dark'
    })
    useEffect(() => {
        localStorage.setItem('theme', theme)
    }, [theme])
    return (
        <ThemeContext.Provider value={{theme, themeDispatch}}>
            {props.children}
        </ThemeContext.Provider>
    )
}

export default ThemeContextProvider