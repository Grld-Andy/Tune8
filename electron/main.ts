import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
// import { createRequire } from 'node:module'
// const require = createRequire(import.meta.url)
import fs from 'fs'
import * as mm from 'music-metadata'
import { currentSongs } from '../src/assets'
import { Song } from '../src/data'
import { v1 } from 'uuid'
import { DurationToString } from '../src/utilities'
import { createTablesOnStartUp, fetchSongsFromDatabase } from './db'

// create table if not exist
createTablesOnStartUp()
fetchSongsFromDatabase()

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

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC ?? '/', 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
    },
    show: false,
    maximizable: true,
    autoHideMenuBar: true
  })

  win.webContents.openDevTools()
  
  // Show the window once it is ready to be shown
  win.once('ready-to-show', () => {
    win?.show()
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (!VITE_DEV_SERVER_URL) {
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
  globalShortcut.unregisterAll();
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

app.whenReady().then(() => {
  createWindow()

  // Register the Media Next Track key
  globalShortcut.register('MediaNextTrack', () => {
    if (win) {
      win.webContents.send('play-next-song');
    }
  })

  // Register the Media Previous Track key
  globalShortcut.register('MediaPreviousTrack', () => {
    if (win) {
      win.webContents.send('play-prev-song');
    }
  })
})

//  minimize
let prevSize: number[] = []
ipcMain.on('minimize', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win && !win.isMaximized() && !win.fullScreen) {
      const windowOnTop = !win.isAlwaysOnTop()
      if(win.isAlwaysOnTop()){
        prevSize = [500, 500]
      }
      win.setAlwaysOnTop(windowOnTop, 'floating')
      if(windowOnTop){
        prevSize = win.getSize()
      }else{
        prevSize = []
      }
      win.setSize(windowOnTop ? 300 : prevSize[0], windowOnTop ? 250 : prevSize[1])
      win.setResizable(windowOnTop ? false : true)
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

// load music data
ipcMain.handle('get-all-songs', async () => {
  return await getAllSongs()
})
const getAllSongs = async () => {
  const songPaths = currentSongs.map(song => song.src)
  const songs = []

  for (const songPath of songPaths) {
    try {
      const songData = await getSongTags(songPath)
      songs.push(songData)
    } catch (err) {
      console.error('Error fetching song tags:', err)
    }
  }
  return songs
}
const getSongTags = async (songPath: string) => {
  return new Promise((resolve, reject) => {
    mm.parseFile(songPath)
      .then(async (metadata: mm.IAudioMetadata) => {
        const duration = DurationToString(metadata.format.duration ?? 0)
        let imageSrc = metadata.common.picture && metadata.common.picture.length > 0
          ? await saveImageToFile(metadata.common.picture[0])
          : await getRandomPlaceholderImage()
        if(!imageSrc)
          imageSrc = 'placeholders/music1.jpg'
        
        const musicDataObject: Song = {
          id: v1(),
          src: songPath,
          tag: {
            tags: {
              title: metadata.common.title ? metadata.common.title : path.basename(songPath).split('.mp3')[0],
              artist: metadata.common.artist ? metadata.common.artist : 'Unknown Artist',
              album: metadata.common.album ? metadata.common.album : 'Unknown Album',
              year: metadata.common.year ? metadata.common.year : 0,
              genre: metadata.common.genre ? metadata.common.genre[0] : 'Unknown Genre',
            },
          },
          imageSrc,
          duration,
          isFavorite: false,
        }
        resolve(musicDataObject)
      })
      .catch((err: Error|null) => {
        reject(err)
      })
  })
}

const saveImageToFile = async (picture: mm.IPicture) => {
  const imagesDir = path.join(RENDERER_DIST, 'public/images')

  if (!fs.existsSync(imagesDir)) {
    try {
      await fs.promises.mkdir(imagesDir, { recursive: true })
      console.log('Folder created')
    } catch (err) {
      console.error(err)
    }
  }
  const imageBuffer = picture.data
  const imageFormat = picture.format
  const imageFileName = `${v1()}.${imageFormat.split('/')[1]}`
  const imagePath = path.join(imagesDir, imageFileName)
  console.log('saving image: ', imagePath)
  
  try {
    await fs.promises.writeFile(imagePath, imageBuffer)
    // change when building
    return `public/images/${imageFileName}`
  } catch (error) {
    console.error('Error saving image to file:', error)
    return null
  }
}

const getRandomPlaceholderImage = async () => {
  const imageFolderPath = '/placeholders'
  try {
    const imageFiles = await fs.promises.readdir(imageFolderPath)
    const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)]
    return `/placeholders/${randomImage}`
  } catch (error) {
    console.error('Error getting random placeholder image:', error)
    return null
  }
}