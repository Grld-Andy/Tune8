import { createContext, Dispatch, ReactNode, useEffect, useReducer } from "react";
import { themeReducer } from "../reducers/ThemeReducer";

interface ThemeContextType {
    theme: string
    dispatch: Dispatch<{ type: string }>
}
interface Props {
    children: ReactNode
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    dispatch: () => null
})

const ThemeContextProvider: React.FC<Props> = (props) => {
    const [theme, dispatch]: [string, Dispatch<{ type: string; }>] = useReducer(themeReducer, 'dark', () => {
        const localTheme: string|null = localStorage.getItem('theme')
        return localTheme ? localTheme : 'dark'
    })
    useEffect(() => {
        localStorage.setItem('theme', theme)
    }, [theme])
    return (
        <ThemeContext.Provider value={{theme, dispatch}}>
            {props.children}
        </ThemeContext.Provider>
    )
}

export default ThemeContextProvider