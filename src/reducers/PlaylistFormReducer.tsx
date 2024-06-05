export const PlaylistFormReducer = (state: {isOpen: boolean}, action: {type: string}) => {
    switch(action.type){
        case 'OPEN_FORM':
            return {...state, isOpen: true}
        case 'CLOSE_FORM':
            return {state, isOpen: false}
        default:
            return state
    }
}