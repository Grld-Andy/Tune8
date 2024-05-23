export interface Song {
    title: string,
    artist: string,
    album: string,
    image: string
}
export interface AlbumsInterface {
    [key: string]: Song[]
}