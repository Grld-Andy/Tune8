export interface RowSong{
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
export interface RowPlaylist{
    id: number;
    songId: number;
    dateCreated: string
}
export interface RowQueue{
    id: number;
    song_id: number
}
export interface RowLyrics{
    id: number;
    song_id: number;
    lyric: string
}