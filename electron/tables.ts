export interface SongsRow{
    id: number;
    title: string;
    artist: string;
    album: string;
    imageSrc: string;
    duration: string;
    year: string;
    genre: string;
    url: string;
    isFavorite: string;
    dateAdded: string;
    lastPlayed: string
}
export interface PlaylistRow{
    id: number;
    songId: number;
    dateCreated: string
}
export interface QueueRow{
    id: number;
    song_id: number
}