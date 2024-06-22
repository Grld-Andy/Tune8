import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...

  // make mini always on top
  Minimize(){
    ipcRenderer.send('minimize')
  },
  Maximize(){
    ipcRenderer.send('maximize')
  },
  GetSongs(){
    const allSongs = ipcRenderer.invoke('get-all-songs')
    return allSongs
  },
  onPlayNext: (callback: (event: Electron.IpcRendererEvent) => void) => ipcRenderer.on('play-next-song', callback),
  onPlayPrev: (callback: (event: Electron.IpcRendererEvent) => void) => ipcRenderer.on('play-prev-song', callback),
  onPlayPause: (callback: (event: Electron.IpcRendererEvent) => void) => ipcRenderer.on('play-pause-song', callback),
})
