export interface Song {
    id: string,
    tag: {
        tags: {
            title: string,
            artist: string,
            album: string,
            year: number,
            genre: string
        }
    }
    imageSrc: string,
    duration: string,
    isFavorite: boolean,
    src: string,
    lyrics: string
}
export interface SortedSongs {
    [key: string]: Set<Song>
}
export interface PlaylistInterface {
    name: string,
    songs: Array<Song>,
    defaultImage?: string
}
export interface SortedPlaylists {
    [key: string]: Set<PlaylistInterface>
}