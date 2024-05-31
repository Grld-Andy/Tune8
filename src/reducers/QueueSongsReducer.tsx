import { Song } from "../data"

export const QueueSongsReducer = (queue: Array<Song>, action: {type: string, payload: Array<Song>|[], index: number}) : Array<Song> => {
    switch(action.type){
        case 'SET_QUEUE':
            return action.payload
        case 'ADD_TO_QUEUE':
            return [...queue, ...action.payload]
        case 'PLAY_NEXT':
            return [...queue.slice(0,action.index+1), ...action.payload, ...queue.slice(action.index+1)]
        case 'CLEAR_QUEUE':
            return []
        default:
            return queue
    }
}