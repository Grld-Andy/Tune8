/// <reference types="vite-plugin-electron/electron-env" />

import { Song } from ".";

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
  Minimize: () => void;
  Maximize: () => void;
  GetSongs: (musicPaths: string) => Array<Song>;
  onPlayNext: (callback: (event: IpcRendererEvent) => void) => void;
  onPlayPrev: (callback: (event: IpcRendererEvent) => void) => void;
  onPlayPause: (callback: (event: IpcRendererEvent) => void) => void;
  saveLyricsToDatabase: (lyricsData: {lyric: string, song_id: string}) => string;
  getLyricsFromDatabase: (songId: number) => string;
  addMusicDirectory: () => Promise<string>;
  updateSongDatabase: (song: Song) => string;
  addSongToQueue: (song: Song) => string;
  removeSongFromQueue: (id: number) => string;
  getQueue: () => string;
  clearQueue: () => string;
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: IpcRendererCustom;
}
