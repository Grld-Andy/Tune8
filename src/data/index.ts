export interface Song {
    tag: {
        tags: {
            title: string,
            artist: string,
            album: string,
            year: number
        }
    }
    imageSrc: string,
    duration: string
}
export interface SortedSongs {
    [key: string]: Set<Song>
}