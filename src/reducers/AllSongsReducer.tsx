import { Song } from "../data"

export const AllSongsReducer = (songs: Array<Song>|[], action: {type: string, payload: Array<Song>|[], path?: string}): Array<Song> => {
    switch(action.type){
        case 'SET_SONGS':
            return mergeSongs(songs, action.payload)
        case 'UPDATE_SONG':
            return songs.map(song => {
                const updatedSong = action.payload.find(s => s.id === song.id)
                return updatedSong ? updatedSong : song
            })
        case 'DELETE_SONGS':
                if(action.path){
                    console.log(action.path)
                    const path = action.path
                    return songs.filter(song => !song.src.startsWith(path))
                }
                return songs
        case 'CLEAR_SONGS':
            return []
        default:
            return songs
    }
}

// Helper function to merge songs ensuring no duplicate song.src
const mergeSongs = (currentSongs: Array<Song>, newSongs: Array<Song>): Array<Song> => {
    const mergedSongs = new Map<string, Song>();
    // Add current songs to Map
    currentSongs.forEach(song => {
        mergedSongs.set(song.src, song);
    });
    // Add new songs to Map, overwriting existing songs with the same song.src
    newSongs.forEach(song => {
        mergedSongs.set(song.src, song);
    });
    // Convert Map values back to array
    return Array.from(mergedSongs.values());
}