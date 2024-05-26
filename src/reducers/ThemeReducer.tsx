export const themeReducer = (state:string, action: { type: string }) => {
    switch(action.type){
        case 'CHANGE_THEME':
            return state === 'dark' ? 'light' : 'dark'
        default:
            return state
    }
}