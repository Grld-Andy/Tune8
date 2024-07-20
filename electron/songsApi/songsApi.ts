import fs from 'fs'
import * as mm from 'music-metadata'
import { resolve } from 'path'
import path from 'node:path'
import { Song } from '../../src/data'
import { v1 } from 'uuid'
import { DurationToString } from '../../src/utilities'
import { RENDERER_DIST } from '../main'
import { fetchSongsFromDatabase, insertSongIntoDatabase } from '../database/db'
import { RowSong } from '../database/tables'
import { app } from 'electron'

async function getFiles(dir: string): Promise<string[]> {
  const subdirs = await fs.promises.readdir(dir)
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = resolve(dir, subdir)
    return (await fs.promises.stat(res)).isDirectory() ? getFiles(res) : res
  }))
  return files.flat()
}
export const getAllSongs = async () => {
  let songs: Array<Song> = []
  songs = await fetchSongsFromDatabase()
  if(songs.length > 0){
    return songs
  }else{
    return []
  }
}
export async function insertNewSongs(path: string){
  const musicFiles = await getFiles(path)
  for (const songPath of musicFiles) {
    try {
      const songData = await getSongTags(songPath)
      insertSongIntoDatabase(songData)
    } catch (err) {
      console.error('Error fetching song tags:', err)
    }
  }
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
              genre: metadata.common.genre ? metadata.common.genre[0] : 'Unknown Genre'
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
  console.log(app.getPath('userData'))
  const imagesDir = path.join(app.getPath('userData'), 'images')
  console.log('creating images folder')
  if (!fs.existsSync(imagesDir)) {
    try {
      await fs.promises.mkdir(imagesDir, { recursive: true })
      console.log('folder created')
    } catch (err) {
      console.error(err)
    }
  }else{
    console.log('folder exists')
  }
  console.log('images dir: ', imagesDir)
  const imageBuffer = picture.data
  const imageFormat = picture.format
  const imageFileName = `${v1()}.${imageFormat.split('/')[1]}`
  const imagePath = path.join(imagesDir, imageFileName)
  
  try {
    await fs.promises.writeFile(imagePath, imageBuffer)
    return path.join(app.getPath('userData'), `images/${imageFileName}`)
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
    return path.join(RENDERER_DIST, `placeholders/${randomImage}`)
  } catch (error) {
    console.error('Error getting random placeholder image:', error)
    return null
  }
}

export const formatSongRowToSongObject: (s:RowSong) => Song = (song: RowSong) => {
  const songObject = {
    id: song.id,
    src: song.src,
    tag: {
      tags: {
        title: song.title,
        artist: song.artist,
        album: song.album,
        year: song.year,
        genre: song.genre,
      },
    },
    imageSrc: song.imageSrc,
    duration: song.duration,
    isFavorite: song.isFavorite,
    dateAdded: song.dateAdded
  }
  return songObject
}
export const formatCurrentSongRowToSongObject: (s:RowSong) => Song = (song: RowSong) => {
  const songObject = {
    id: song.id,
    src: song.src,
    tag: {
      tags: {
        title: song.title,
        artist: song.artist,
        album: song.album,
        year: song.year,
        genre: song.genre,
      },
    },
    imageSrc: song.imageSrc,
    duration: song.duration,
    isFavorite: song.isFavorite,
    dateAdded: song.dateAdded
  }
  return songObject
}