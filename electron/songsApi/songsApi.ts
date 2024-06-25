import fs from 'fs'
import * as mm from 'music-metadata'
import { resolve } from 'path'
import path from 'node:path'
import { Song } from '../../src/data'
import { v1 } from 'uuid'
import { DurationToString } from '../../src/utilities'
import { RENDERER_DIST } from '../main'
import { fetchSongsFromDatabase, insertSongIntoDatabase } from '../database/db'

async function getFiles(dir: string): Promise<string[]> {
  const subdirs = await fs.promises.readdir(dir)
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = resolve(dir, subdir)
    return (await fs.promises.stat(res)).isDirectory() ? getFiles(res) : res
  }))
  return files.flat()
}
export const getAllSongs = async (musicPaths: string) => {
  let songs: Array<Song> = []
  songs = await fetchSongsFromDatabase()
  if(songs.length > 0){
    return songs
  }
  let songPaths: Array<string> = []
  if (musicPaths) {
    try {
      songPaths = await getFiles(musicPaths)
    } catch (err) {
      console.error('Error reading files:', err)
      songPaths = []
    }
  } else {
    return songs
  }

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
const getSongTags: (s:string) => Promise<Song> = async (songPath: string) => {
  return new Promise((resolve, reject) => {
    mm.parseFile(songPath)
      .then(async (metadata: mm.IAudioMetadata) => {
        const duration = DurationToString(metadata.format.duration ?? 0)
        let imageSrc = metadata.common.picture && metadata.common.picture.length > 0
          ? await saveImageToFile(metadata.common.picture[0])
          : await getRandomPlaceholderImage()
        if(!imageSrc)
          imageSrc = path.join(RENDERER_DIST, `placeholders/music${Math.floor(Math.random() * 4) + 1}.jpg`)
        
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
          dateAdded: new Date()
        }
        insertSongIntoDatabase(musicDataObject)
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
    } catch (err) {
      console.error(err)
    }
  }
  const imageBuffer = picture.data
  const imageFormat = picture.format
  const imageFileName = `${v1()}.${imageFormat.split('/')[1]}`
  const imagePath = path.join(imagesDir, imageFileName)
  
  try {
    await fs.promises.writeFile(imagePath, imageBuffer)
    return path.join(RENDERER_DIST, `public/images/${imageFileName}`)
  } catch (error) {
    console.error('Error saving image to file:', error)
    return null
  }
}

const getRandomPlaceholderImage = async () => {
  const imageFolderPath = path.join(RENDERER_DIST, 'placeholders')
  try {
    const imageFiles = await fs.promises.readdir(imageFolderPath)
    const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)]
    return path.join(RENDERER_DIST, `/placeholders/${randomImage}`)
  } catch (error) {
    console.error('Error getting random placeholder image:', error)
    return null
  }
}