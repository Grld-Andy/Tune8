import { app, BrowserWindow, dialog, ipcMain, globalShortcut } from 'electron'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
if (require('electron-squirrel-startup')) app.quit();


import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { addPlaylist, addSongToPlaylist, clearSongsInQueue,
  clearSongsInDatabase, deletePlaylist, deleteQueueById, fetchAllSongsInQueue,
  getPlaylists, getPlaylistSongs, getSongLyricsWithId, insertSongToQueue,
  removeSongFromPlaylist, saveSongLyrics, updatePlaylist, updateSongInDatabase,
  createAllTables, insertIntoMusicPath, deleteFromMusicPath, getMusicPaths,
  getCurrentSong, 
  updateCurrentSong} from './database/db'
import { getAllSongs } from './songsApi/songsApi'
import { Song } from './types/index'


const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

// create table if not exist
createAllTables()

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC ?? '/', 'setupFiles/setup.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
      devTools: false
    },
    show: false,
    maximizable: true,
    autoHideMenuBar: true
  })

  // win.webContents.openDevTools()
  
  // Show the window once it is ready to be shown
  win.once('ready-to-show', () => {
    win?.show()
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile(path.join(__dirname, 'index.html'))
    win.loadFile(path.join(RENDERER_DIST, 'index.html')).catch((err) => {
      console.error('Failed to load file:', err)
    })
  }
}

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// const gotTheLock = app.requestSingleInstanceLock()

app.whenReady().then(() => {
  createWindow()

  // Register the Media Next Track key
  globalShortcut.register('MediaNextTrack', () => {
    if (win) {
      win.webContents.send('play-next-song')
    }
  })

  // Register the Media Previous Track key
  globalShortcut.register('MediaPreviousTrack', () => {
    if (win) {
      win.webContents.send('play-prev-song')
    }
  })
})


// open dialog to select music folder
const handleDirectoryOpen = async () => {
  try{
    const result = await dialog.showOpenDialog({properties: ['openDirectory']})
    if(!result.canceled){
      const id =  await insertIntoMusicPath(result.filePaths[0])
      return {id: id, path: result.filePaths}
    }else{
      return {id:-1, path: ''}
    }
  }catch (error){
    console.error(error)
  }
}
ipcMain.handle('dialog:openDirectory', handleDirectoryOpen)

// SCREEN SIZING API
//  minimize
let prevSize: number[] = []
ipcMain.on('minimize', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win && !win.isMaximized() && !win.fullScreen) {
    const windowOnTop = !win.isAlwaysOnTop()
    if (windowOnTop) {
      prevSize = win.getSize()
    }
    win.setAlwaysOnTop(windowOnTop, 'floating')
    win.setSize(windowOnTop ? 300 : (prevSize.length > 0 ? prevSize[0] : win.getSize()[0]),
                windowOnTop ? 250 : (prevSize.length > 0 ? prevSize[1] : win.getSize()[1]))
    win.setResizable(!windowOnTop)
  }
})
// maximize
ipcMain.on('maximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win && prevSize.length === 0) {
    if (win.fullScreen) {
      win.fullScreen = false
      win.setResizable(true)
    } else {
      win.fullScreen = true
      win.setResizable(true)
    }
  }
})



// LYRICS API
// save lyrics
ipcMain.handle('save-song-lyrics', async(_event, lyricsData:{lyric: string, song_id: string}) => {
  return await saveSongLyrics(lyricsData)
})
// get lyrics
ipcMain.handle('get-song-lyrics', async(_event, songId) => {
  return await getSongLyricsWithId(songId)
})


//  SONG API
// load song data
ipcMain.handle('get-all-songs', async (_event, musicPaths:string) => {
  return await getAllSongs(musicPaths)
})
// update song
ipcMain.handle('update-song', (_event, song: Song) => {
  console.log(song.tag.tags.title)
  return updateSongInDatabase(song)
})
// clear songs
ipcMain.handle('clear-songs', () => {
  return clearSongsInDatabase()
})


// CURRENT SONG
ipcMain.handle('get-last-played', () => {
  return getCurrentSong()
})
ipcMain.handle('update-current-song', (_event, song_id: string, queue_no: number) => {
  return updateCurrentSong(song_id, queue_no)
})


//  QUEUE API  
ipcMain.handle('add-song-to-queue', async(_event, song: Song) => {
  return await insertSongToQueue(song)
})
ipcMain.handle('remove-song-from-queue', async(_event, id:number) => {
  return await deleteQueueById(id)
})
ipcMain.handle('get-queue', async() => {
  return fetchAllSongsInQueue()
})
ipcMain.handle('clear-queue', async() => {
  return clearSongsInQueue()
})


// MUSIC PATHS
ipcMain.handle('delete-music-path', async (_event, musicPathId: number) => {
  return await deleteFromMusicPath(musicPathId)
})
ipcMain.handle('get-music-paths', async () => {
  return await getMusicPaths()
})

// PLAYLISTS
ipcMain.handle('get-playlists', async () => {
  return await getPlaylists()
})
ipcMain.handle('get-playlist-songs', async (_event, id: number) => {
  return await getPlaylistSongs(id)
})
ipcMain.handle('create-playlist', async (_event, name: string, defaultImage: string) => {
  return await addPlaylist(name, defaultImage)
})
ipcMain.handle('delete-playlist', async (_event, id: number) => {
  return await deletePlaylist(id)
})
ipcMain.handle('update-playlist', async (_event, id: number, name: string) => {
  return await updatePlaylist(id, name)
})
ipcMain.handle('add-song-to-playlist', async (_event, songId: string, playlistId: number) => {
  return await addSongToPlaylist(songId, playlistId)
})
ipcMain.handle(('remove-song-from-playlist'), async (_event, songId: string, playlistId: number) => {
  return await removeSongFromPlaylist(songId, playlistId)
})
