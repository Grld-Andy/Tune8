import { Song } from "../data"

export const QueueSongsReducer = (queue: Array<Song>, action: {type: string, payload: Array<Song>|[], index: number}) : Array<Song> => {
    switch(action.type){
        case 'SET_QUEUE':
            return action.payload
        case 'ADD_TO_QUEUE':
            // action.payload.forEach(song => {
            //     window.ipcRenderer.addSongToQueue(song)
            // })
            return [...queue, ...action.payload]
        case 'REMOVE_FROM_QUEUE':
            // window.ipcRenderer.removeSongFromQueue()
            return [...queue.slice(0, action.index), ...queue.slice(action.index+1)]
        case 'PLAY_NEXT':
            return [...queue.slice(0,action.index+1), ...action.payload, ...queue.slice(action.index+1)]
        case 'CLEAR_QUEUE':
            // window.ipcRenderer.clearQueue()
            return []
        default:
            return queue
    }
}