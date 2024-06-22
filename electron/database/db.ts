import { createRequire } from 'node:module'
import { RowLyrics, RowQueue, RowSong } from './tables'
import { Song } from '../types/index'
import path from 'node:path'
import { MAIN_DIST } from '../main'
const require = createRequire(import.meta.url)
const sqlite3 = require('sqlite3').verbose()

// const database
const databasePath = path.join(MAIN_DIST, 'data/database')
const database = new sqlite3.Database(databasePath)

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
            src TEXT UNIQUE,
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


// LYRICS (post/get)
export async function getSongLyricsWithId(id: string){
    const db = new sqlite3.Database(databasePath)
    return new Promise((resolve, reject) => {
        db.get(`SELECT lyric FROM lyrics WHERE song_id = ${id}`, (err: Error, row: RowLyrics) => {
            if (err) {
                reject(err)
            } else {
                db.close((err:Error) => {
                    if(err){
                        console.error('An error occured')
                    }
                    else{
                        console.log('Database closed succefully')
                    }
                })
                resolve(row)
            }
        })
    })
}
export async function saveSongLyrics(lyrics:{lyric: string, song_id: string}){
    const db = new sqlite3.Database(databasePath)
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO lyrics (lyric, song_id) VALUES (?,?)`, [lyrics.lyric, lyrics.song_id], (err: Error) => {
            if (err) {
                reject(err)
            } else {
                db.close((err:Error) => {
                    if(err){
                        console.error('An error occured')
                    }
                    else{
                        console.log('Database closed succefully')
                    }
                })
                resolve('Saved')
            }
        })
    })
}


// SONGS (get/post/update)
export async function fetchSongsFromDatabase() {
  try {
      const db = new sqlite3.Database(databasePath)
      const rows: Array<RowSong> = await new Promise((resolve, reject) => {
          db.all('SELECT * FROM songs', (err: unknown, rows: Array<RowSong>) => {
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
export async function insertSongIntoDatabase(songObject: Song){
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(databasePath)
        db.run(`INSERT INTO songs (title, artist, album, year, genre, imageSrc, duration, src) VALUES (?,?,?,?,?,?,?,?)`,
            [songObject.tag.tags.title, songObject.tag.tags.artist, songObject.tag.tags.album, songObject.tag.tags.year, songObject.tag.tags.genre, songObject.imageSrc, songObject.duration, songObject.src],
            function (err: Error) {
                if (err) {
                    reject(err)
                } else {
                    db.close((err: Error) => {
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
export async function updateSongInDatabase(songObject: Song){
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(databasePath)
        db.run(`UPDATE songs SET title =?, artist =?, album =?, year =?, genre =?, imageSrc =?, duration =?, src =? WHERE id =?`,
            [songObject.tag.tags.title, songObject.tag.tags.artist, songObject.tag.tags.album,
                songObject.tag.tags.year, songObject.tag.tags.genre, songObject.imageSrc,
                songObject.duration, songObject.src, songObject.id],
            function (err: Error) {
                if (err) {
                    reject(err)
                } else {
                    db.close((err: Error) => {
                        if (err) {
                            console.error(err.message)
                        } else {
                            console.log('Database connection closed.')
                        }
                    })
                    resolve("Successful")
                }
            }
        )
    })
}


// QUEUE
export async function insertSongToQueue(song:Song){
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(databasePath)
        db.run(`INSERT INTO queue (song_id) VALUES (?)`, [song.id], (err: Error) => {
            if (err) {
                reject(err)
            } else {
                db.close((err: Error) => {
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
export async function clearSongsInQueue(){
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(databasePath)
        db.run(`DELETE FROM queue`, (err: Error) => {
            if (err) {
                reject(err)
            } else {
                db.close((err: Error) => {
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
export async function fetchAllSongsInQueue() {
    const db = new sqlite3.Database(databasePath)
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM queue`, [], (err: Error, queueRows: Array<RowQueue>) => {
            if (err) {
                return reject(err);
            }
            const songIds = queueRows.map(row => row.song_id);
            if (songIds.length === 0) {
                return resolve([]);
            }
            const fetchSongsQuery = `SELECT * FROM songs WHERE id IN (${songIds.join(',')})`;

            db.all(fetchSongsQuery, [], (err:Error, songRows: Array<RowSong>) => {
                if (err) {
                    return reject(err);
                }
                resolve(songRows);
            });
        });
    });
}
export async function deleteQueueById(id: number){
    const db = new sqlite3.Database(databasePath)
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM queue WHERE id =?`, [id], (err: Error) => {
            if (err) {
                reject(err)
            } else {
                db.close((err: Error) => {
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