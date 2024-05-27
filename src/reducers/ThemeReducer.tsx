export const themeReducer = (state:string, action: { type: string }) => {
    switch(action.type){
        case 'DARK_THEME':
            return 'dark'
        case 'LIGHT_THEME':
            return 'light'
        default:
            return state
    }
}