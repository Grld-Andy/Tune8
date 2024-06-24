import { placeholderSongImages } from "../assets";
import { PlaylistInterface, Song } from "../data";

export const PlaylistReducer = (playlists: Array<PlaylistInterface>, action: {type: string, payload: PlaylistInterface, songs?: Array<Song>, newName?: string}) : Array<PlaylistInterface> => {
    switch(action.type){
        case 'CREATE_PLAYLIST':
            if(!playlists.some(playlist => playlist.name === action.payload.name)){
                action.payload.defaultImage = placeholderSongImages[Math.floor(Math.random() * 4)]
                return [...playlists, action.payload]
            }
            else return Array.from(new Set(playlists))
        case 'ADD_TO_PLAYLIST':
            return playlists.map(playlist => {
                if(playlist.name === action.payload.name && action.payload.songs.length > 0){
                    return { ...playlist, songs: Array.from(new Set([...playlist.songs, ...action.payload.songs]))}
                }else{
                    return playlist
                }
            })
        case 'EDIT_PLAYLIST':
            return playlists.map(playlist => {
                if(playlist.id === action.payload.id && action.newName){
                    return {...playlist, name: action.newName}
                }else{
                    return playlist
                }
            })
        case 'REMOVE_PLAYLIST':
            return playlists.filter(playlist => playlist.name !== action.payload.name)
        case 'REMOVE_FROM_PLAYLIST':
            return playlists.map(playlist => {
                if(playlist.name === action.payload.name){
                    if(playlist.songs.length === 1)
                        return {...playlist, songs: [], defaultImage: placeholderSongImages[Math.floor(Math.random() * 4)]}
                    else
                        return {...playlist, songs: playlist.songs.filter(song => song.tag.tags.title !== action.payload.songs[0].tag.tags.title)}
                }else{
                    return playlist
                }
            })
        case 'CLEAR_PLAYLIST':
            return playlists.map(playlist => {
                if(playlist.id === action.payload.id){
                    return {...playlist, songs: [], defaultImage: placeholderSongImages[Math.floor(Math.random() * 4)]}
                }else{
                    return playlist
                }
            })
        default:
            return playlists
    }
}