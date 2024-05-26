export const themeReducer = (state:string, action: { type: string }) => {
    switch(action.type){
        case 'DARK_MODE':
            return state = 'dark'
        case 'LIGHT_MODE':
            return state = 'light'
        default:
            return state
    }
}