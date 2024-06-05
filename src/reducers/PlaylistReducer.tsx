import { placeholderSongImages } from "../assets";
import { PlaylistInterface, Song } from "../data";

export const PlaylistReducer = (playlists: Array<PlaylistInterface>, action: {type: string, payload: PlaylistInterface, song?: Song}) : PlaylistInterface[] => {
    switch(action.type){
        case 'CREATE_PLAYLIST':
            if(!playlists.some(playlist => playlist.name === action.payload.name))
                return [...playlists, action.payload]
            else return playlists
        case 'REMOVE_PLAYLIST':
            return playlists.filter(playlist => playlist.name !== action.payload.name)
        // case 'ADD_TO_PLAYLIST':
        //     return playlists.map(playlist => {
        //         if(playlist.name === action.payload.name){
        //             return {...playlist, songs: [...playlist.songs, action.song]}
        //         }else{
        //             return playlist
        //         }
        //     })
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
                if(playlist.name === action.payload.name){
                    return {...playlist, songs: [], defaultImage: placeholderSongImages[Math.floor(Math.random() * 4)]}
                }else{
                    return playlist
                }
            })
        default:
            return playlists
    }
}