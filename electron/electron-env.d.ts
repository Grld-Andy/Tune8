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
  Minimize: () => void;
  Maximize: () => void;
  GetSongs: () => Array<Song>;
  onPlayNext: (callback: (event: IpcRendererEvent) => void) => void;
  onPlayPrev: (callback: (event: IpcRendererEvent) => void) => void;
  onPlayPause: (callback: (event: IpcRendererEvent) => void) => void;
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: IpcRendererCustom;
}
