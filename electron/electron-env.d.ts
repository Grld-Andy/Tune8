/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// IpcRendererInterface
interface IpcRendererCustom extends Electron.IpcRenderer {
  Minimize: () => void;//
  Maximize: () => void;//
  GetSongs: () => Promise<Array<Song>>;//
  onPlayNext: (callback: (event: Electron.IpcRendererEvent) => void) => void;
  onPlayPrev: (callback: (event: Electron.IpcRendererEvent) => void) => void;
  onPlayPause: (callback: (event: Electron.IpcRendererEvent) => void) => void;
  saveLyricsToDatabase: (lyricsData: { lyric: string; song_id: string }) => Promise<string>;//
  getLyricsFromDatabase: (songId: string) => Promise<string>;//
  addMusicDirectory: () => Promise<RowMusicPath>;//
  updateSongDatabase: (song: Song) => Promise<string>;//not done
  clearSongs: () => Promise<string>;//
  getLastPlayedSong: () => Promise<{song: Song, queue_no: number}>;//
  updateCurrentSong: (song_id: string, queue_no: number) => Promise<string>;//
  addSongToQueue: (song: Song) => Promise<string>;
  removeSongFromQueue: (id: number) => Promise<string>;
  getQueue: () => Promise<string>;
  clearQueue: () => Promise<string>;
  getPlaylists: () => Promise<Array<PlaylistInterface>>;//
  getPlaylistSongs: (id: number) => Promise<Array<Song>>;//
  createPlaylist: (name: string, defaultImage: string) => Promise<number>;//
  deletePlaylist: (id: number) => Promise<string>;//
  updatePlaylist: (id: number, name: string) => Promise<string>;//
  addSongToPlaylist: (songId: string, playlistId: number) => Promise<string>;//
  removeSongFromPlaylist: (songId: string, playlistId: number) => Promise<string>;//
  removeMusicPath: (musicPathId: number) => Promise<string>;
  fetchMusicPaths: () => Promise<Array<RowMusicPath>>;
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: IpcRendererCustom;
}
