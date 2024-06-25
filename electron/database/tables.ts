export interface RowSong{
    id: string;
    title: string;
    artist: string;
    album: string;
    imageSrc: string;
    duration: string;
    year: number;
    genre: string;
    src: string;
    isFavorite: boolean;
    dateAdded: Date;
    lastPlayed: string
}
export interface RowCurrentSong {
    song: RowSong;
    queue_no: number;
}
export interface RowMusicPath{
    id: number,
    path: string
}
export interface RowPlaylist{
    id: number;
    name: string;
    dateCreated: string;
    defaultImage: string;
}
export interface RowPlaylistSong{
    id: number;
    song_id: string;
    playlist_id: number;
}
export interface RowQueue{
    id: number;
    song_id: number,
    queue_no: number
}
export interface RowLyrics{
    id: number;
    song_id: number;
    lyric: string
}