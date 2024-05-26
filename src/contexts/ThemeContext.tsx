import { createContext, Dispatch, useReducer } from "react";
import { themeReducer } from "../reducers/ThemeReducer";

export const ThemeContext = createContext()

const ThemeContextProvider = (props: { children: React.JSX.Element }) => {
    const [theme, dispatch]: [string, Dispatch<{ type: string; }>] = useReducer(themeReducer, 'dark', () => {
        const localTheme: string|null = localStorage.getItem('theme')
        return localTheme ? localTheme : 'dark'
    })
    return (
        <ThemeContext.Provider value={{theme, dispatch}}>
            {props.children}
        </ThemeContext.Provider>
    )
}

export default ThemeContextProvider