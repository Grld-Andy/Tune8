import { createRequire } from 'node:module'
import { SongsRow } from './tables'
import { Song } from '../src/data'
const require = createRequire(import.meta.url)
const sqlite3 = require('sqlite3').verbose()

// const database
const database = new sqlite3.Database('./database.db')

export const createTablesOnStartUp = () => {
    database.serialize(() => {
    database.run(`
        CREATE TABLE IF NOT EXISTS songs (
            id INTEGER PRIMARY KEY,
            title TEXT,
            artist TEXT,
            album TEXT,
            imageSrc TEXT,
            duration INTEGER,
            year TEXT,
            genre TEXT,
            url TEXT,
            isFavorite INTEGER DEFAULT 0,
            dateAdded TEXT DEFAULT CURRENT_TIMESTAMP,
            lastPlayed TEXT
        );
        CREATE TABLE IF NOT EXISTS lyrics (
            id INTEGER PRIMARY KEY,
            lyric TEXT,
            song_id INTEGER,
            FOREIGN KEY (song_id) REFERENCES songs(id)
        );
        CREATE TABLE IF NOT EXISTS playlist (
            id INTEGER PRIMARY KEY,
            title TEXT,
            dateCreated TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS playlist_song (
            playlist_id INTEGER,
            song_id INTEGER,
            FOREIGN KEY (playlist_id) REFERENCES playlist(id),
            FOREIGN KEY (song_id) REFERENCES songs(id),
            PRIMARY KEY (playlist_id, song_id)
        );
        CREATE TABLE IF NOT EXISTS queue (
            id INTEGER PRIMARY KEY,
            song_id INTEGER,
            FOREIGN KEY (song_id) REFERENCES songs(id)
        );
    `)
    })
}

export async function fetchSongsFromDatabase() {
  try {
      const db = new sqlite3.Database('./database.db')
      const rows: Array<SongsRow> = await new Promise((resolve, reject) => {
          db.all('SELECT * FROM songs', (err: unknown, rows: Array<SongsRow>) => {
              if (err) {
                  reject(err)
              } else {
                  db.close((err:unknown) => {
                      if(err){
                          console.error('An error occured')
                      }
                      else{
                          console.log('Database closed succefully')
                      }
                  })
                  resolve(rows)
              }
          })
      })
      return rows.map(row => ({
          imageSrc: row.imageSrc,
          duration: row.duration,
          url: row.url,
          isFavorite: row.isFavorite,
          dateAdded: row.dateAdded,
          lastPlayed: row.lastPlayed,
          id: row.id,
          tag: {
              tags: {
                  title: row.title,
                  artist: row.artist,
                  year: row.year,
                  genre: row.genre,
                  album: row.album
              }
          }
      }))
  }catch (error) {
      console.error('Error fetching data from database:', error)
      throw error
  }
}
export async function insertAllMusicDataIntoDatabase(dataArray: Array<Song>) {
    return new Promise((resolve, reject) => {
        const placeholders = dataArray.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', ')
        const values = dataArray.flatMap(data => [
            data.tag.tags.title,
            data.tag.tags.artist,
            data.tag.tags.album,
            data.tag.tags.year,
            data.tag.tags.genre,
            data.imageSrc,
            data.duration,
            data.src
        ])
        
        const db = new sqlite3.Database('./database.db')
        db.run(`INSERT INTO songs (title, artist, album, year, genre, imageSrc, duration, url) VALUES ${placeholders}`,
            values,
            function (err: Error | null) {
            if (err) {
                reject(err)
            } else {
                db.close((err: Error | null) => {
                    if (err) {
                        console.error(err.message)
                    } else {
                        console.log('Database connection closed.')
                    }
                })
                resolve("Successful")
            }
        })
    })
}