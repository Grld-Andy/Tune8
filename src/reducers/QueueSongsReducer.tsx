import { Song } from "../data"

export const QueueSongsReducer = (queue: Array<Song>, action: {type: string, payload: Array<Song>|[]}) : Array<Song> => {
    switch(action.type){
        case 'SET_QUEUE':
            return action.payload
        case 'ADD_TO_QUEUE':
            return [...queue, ...action.payload]
        case 'CLEAR_QUEUE':
            return []
        default:
            return queue
    }
}