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
  GetSongs: (musicPaths: string) => Promise<Array<Song>>;//
  onPlayNext: (callback: (event: Electron.IpcRendererEvent) => void) => void;
  onPlayPrev: (callback: (event: Electron.IpcRendererEvent) => void) => void;
  onPlayPause: (callback: (event: Electron.IpcRendererEvent) => void) => void;
  saveLyricsToDatabase: (lyricsData: { lyric: string; song_id: string }) => Promise<string>;//
  getLyricsFromDatabase: (songId: string) => Promise<string>;//
  addMusicDirectory: () => Promise<string>;//
  updateSongDatabase: (song: Song) => Promise<string>;//not done
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
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: IpcRendererCustom;
}
