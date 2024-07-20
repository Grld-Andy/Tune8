import { SongFormState } from "../contexts/SongFormContext";
import { Song } from "../data";

export const SongFormReducer = (state: SongFormState, action: {type: string, payload: Song}): SongFormState => {
    switch(action.type){
        case 'OPEN_DETAILS':
            return {isOpen: 'details', song: action.payload}
        case 'OPEN_FORM':
            return {isOpen: 'form', song: action.payload}
        case 'CLOSE_MODAL':
            return {isOpen: '', song: null}
        default:
            return state
    }
}