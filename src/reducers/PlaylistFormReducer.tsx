import { PlaylistFormState } from "../contexts/PlaylistFormContext"

export const PlaylistFormReducer = (state: PlaylistFormState, action: {type: string, payload: string}): PlaylistFormState  => {
    switch(action.type){
        case 'OPEN_FORM':
            return {payload: action.payload, isOpen: true}
        case 'CLOSE_FORM':
            return {payload: '', isOpen: false}
        default:
            return state
    }
}