import { ipcRenderer, contextBridge } from 'electron'
import { Song } from './types/index'

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

  Minimize(){
    ipcRenderer.send('minimize')
  },
  Maximize(){
    ipcRenderer.send('maximize')
  },
  GetSongs(musicPaths: string){
    const allSongs = ipcRenderer.invoke('get-all-songs', musicPaths)
    return allSongs
  },
  onPlayNext: (callback: (event: Electron.IpcRendererEvent) => void) => ipcRenderer.on('play-next-song', callback),
  onPlayPrev: (callback: (event: Electron.IpcRendererEvent) => void) => ipcRenderer.on('play-prev-song', callback),
  onPlayPause: (callback: (event: Electron.IpcRendererEvent) => void) => ipcRenderer.on('play-pause-song', callback),


  // LYRICS
  saveLyricsToDatabase: async(lyricsData: {lyric: string, song_id: string}) => {
    const isSaved = await ipcRenderer.invoke('save-song-lyrics', lyricsData)
    return isSaved
  },
  getLyricsFromDatabase: async(songId: number) => {
    const lyrics = await ipcRenderer.invoke('get-song-lyrics', songId)
    return lyrics
  },


  // SONGS
  addMusicDirectory: async () => {
    try {
      const directoryPath = await ipcRenderer.invoke('dialog:openDirectory')
      return directoryPath
    } catch (error) {
        console.error('Error selecting music directory: ', error)
        throw error
    }
  },
  updateSongDatabase: async(song: Song) => {
    const isUpdated = await ipcRenderer.invoke('update-song', song)
    return isUpdated
  },

  // QUEUE
  addSongToQueue: async(song: Song) => {
    const isAdded = await ipcRenderer.invoke('add-song-to-queue', song)
    return isAdded
  },
  removeSongFromQueue: async(id: number) => {
    const isRemoved = await ipcRenderer.invoke('remove-song-from-queue', id)
    return isRemoved
  },
  getQueue: async() => {
    const queue = await ipcRenderer.invoke('get-queue')
    return queue
  },
  clearQueue: async() => {
    const isCleared = await ipcRenderer.invoke('clear-queue')
    return isCleared
  },
})
