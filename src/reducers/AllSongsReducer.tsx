import { Song } from "../data"

export const AllSongsReducer = (songs: Array<Song>|[], action: {type: string, payload: Array<Song>|[]}): Array<Song> => {
    switch(action.type){
        case 'SET_SONGS':
            return Array.from(new Set([...songs, ...action.payload]))
        default:
            return songs
    }
}