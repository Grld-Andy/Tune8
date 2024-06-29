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


  //  RESIZING
  Minimize() {
    ipcRenderer.send('minimize');
  },
  Maximize() {
    ipcRenderer.send('maximize');
  },

  // OTHER FUNCTIONS
  async GetSongs() {
    console.log('gettings so')
    return await ipcRenderer.invoke('get-all-songs');
  },
  onPlayNext(callback: (event: Electron.IpcRendererEvent) => void) {
    console.log('preload next song')
    ipcRenderer.on('play-next-song', callback);
  },
  onPlayPrev(callback: (event: Electron.IpcRendererEvent) => void) {
    ipcRenderer.on('play-prev-song', callback);
  },
  onPlayPause(callback: (event: Electron.IpcRendererEvent) => void) {
    ipcRenderer.on('play-pause-song', callback);
  },

  // LYRICS
  async saveLyricsToDatabase(lyricsData: { lyric: string; song_id: string }) {
    return await ipcRenderer.invoke('save-song-lyrics', lyricsData);
  },
  async getLyricsFromDatabase(songId: string) {
    return await ipcRenderer.invoke('get-song-lyrics', songId);
  },

  // SONGS
  async addMusicDirectory() {
    try {
      return await ipcRenderer.invoke('dialog:openDirectory');
    } catch (error) {
      console.error('Error selecting music directory: ', error);
      throw error;
    }
  },
  async updateSongDatabase(song: Song) {
    return await ipcRenderer.invoke('update-song', song);
  },
  async clearSongs(){
    return await ipcRenderer.invoke('clear-songs')
  },

  // CURRENT SONG
  async getLastPlayedSong(){
    return await ipcRenderer.invoke('get-last-played')
  },
  async updateCurrentSong(song_id: string, queue_no: number) {
    return await ipcRenderer.invoke('update-current-song', song_id, queue_no);
  },

  // QUEUE
  async addSongToQueue(song: Song) {
    return await ipcRenderer.invoke('add-song-to-queue', song);
  },
  async removeSongFromQueue(id: number) {
    return await ipcRenderer.invoke('remove-song-from-queue', id);
  },
  async getQueue() {
    return await ipcRenderer.invoke('get-queue');
  },
  async clearQueue() {
    return await ipcRenderer.invoke('clear-queue');
  }, 

  // PLAYLISTS
  async getPlaylists() {
    return await ipcRenderer.invoke('get-playlists');
  },
  async getPlaylistSongs(id: number) {
    return await ipcRenderer.invoke('get-playlist-songs', id);
  },
  async createPlaylist(name: string) {
    return await ipcRenderer.invoke('create-playlist', name);
  },
  async deletePlaylist(id: number) {
    return await ipcRenderer.invoke('delete-playlist', id);
  },
  async updatePlaylist(id: number, name: string) {
    return await ipcRenderer.invoke('update-playlist', id, name);
  },
  async addSongToPlaylist(songId: string, playlistId: number) {
    return await ipcRenderer.invoke('add-song-to-playlist', songId, playlistId);
  },
  async removeSongFromPlaylist(songId: string, playlistId: number) {
    return await ipcRenderer.invoke('remove-song-from-playlist', songId, playlistId);
  },

  // MUSIC PATHS
  async removeMusicPath(musicPathId: number) {
    return await ipcRenderer.invoke('delete-music-path', musicPathId);
  },
  async fetchMusicPaths() {
    return await ipcRenderer.invoke('get-music-paths');
  },
})
