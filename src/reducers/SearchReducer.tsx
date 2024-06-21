export const SearchReducer = (state: string, action: {type: string, payload: string}) => {
    switch(action.type){
        case 'SET_QUERY':
            return action.payload
        default:
            return state
    }
}