import { Song } from "../data";

export const favoritesReducer = (favorites: Array<Song>, action: {type: string, payload: Array<Song>|[]}) => {
    switch(action.type){
        case 'ADD_TO_FAVORITES':
            return Array.from(new Set([...favorites, ...action.payload]))
        case 'REMOVE_FROM_FAVORITES':
            action.payload.forEach(song => {
                favorites = favorites.filter(favSong => favSong.tag.tags.title !== song.tag.tags.title)
            })
            return favorites
        case 'CLEAR_FAVORITES':
            return []
        default:
            return favorites
    }
}