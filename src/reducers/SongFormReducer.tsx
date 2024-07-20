import { SongFormState } from "../contexts/SongFormContext";
import { Song } from "../data";

export const SongFormReducer = (state: SongFormState, action: {type: string, payload: Song}): SongFormState => {
    switch(action.type){
        case 'OPEN_FORM':
            return {isOpen: true, song: action.payload}
        case 'CLOSE_FORM':
            return {isOpen: false, song: null}
        default:
            return state
    }
}