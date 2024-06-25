import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { RowCurrentSong, RowLyrics, RowMusicPath, RowPlaylist, RowPlaylistSong, RowQueue, RowSong } from './tables'
import { Song } from '../types/index'
import path from 'node:path'
const require = createRequire(import.meta.url)
const sqlite3 = require('sqlite3').verbose()
const { app } = require('electron')

// const database
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isDev = !app.isPackaged
let databasePath: string
if (isDev) {
    databasePath = path.join(__dirname, 'database.db')
} else {
    databasePath = path.join(process.resourcesPath, 'app/dist-electron/database.db')
}
const database = new sqlite3.Database(databasePath)

function dropTable(tableName: string){
    const db = new sqlite3.Database(databasePath)

    db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS ${tableName}`, function(err: Error){
            if(err){
                console.error(err)
            }else{
                console.log('Deleted')
            }
        })
    })
    db.close((err: Error) => {
        if(err){console.error(err)}
        else{console.log('closed')}
    })
}
export const createMusicPaths = () => {
    database.serialize(() => {
        database.run(
        `CREATE TABLE IF NOT EXISTS musicPaths (
            id INTEGER PRIMARY KEY,
            path TEXT
        );`
        )
    })
}
export const createLyricsTable = () => {
    database.serialize(() => {
        database.run(
        `CREATE TABLE IF NOT EXISTS lyrics (
            id INTEGER PRIMARY KEY,
            lyric TEXT,
            song_id TEXT,
            FOREIGN KEY (song_id) REFERENCES songs(id)
        );`
        )
    })
}
export const createQueueTable = () => {
    database.serialize(() => {
        database.run(
        `CREATE TABLE IF NOT EXISTS queue (
            id INTEGER PRIMARY KEY,
            song_id TEXT,
            queue_no INTEGER,
            FOREIGN KEY (song_id) REFERENCES songs(id)
        );`
        )
    })
}
export const createPlaylistTable = () => {
    database.serialize(() => {
        database.run(
        `CREATE TABLE IF NOT EXISTS playlist (
            id INTEGER PRIMARY KEY,
            name TEXT,
            dateCreated TEXT DEFAULT CURRENT_TIMESTAMP,
            defaultImage TEXT
        );`
        )
    })
    database.serialize(() => {
        database.run(`
        CREATE TABLE IF NOT EXISTS playlist_song (
            playlist_id INTEGER,
            song_id TEXT,
            FOREIGN KEY (playlist_id) REFERENCES playlist(id),
            FOREIGN KEY (song_id) REFERENCES songs(id),
            PRIMARY KEY (playlist_id, song_id)
        );`
        )
    })
}
export const createSongTable = () => {
    database.serialize(() => {
    database.run(`
        CREATE TABLE IF NOT EXISTS songs (
            id TEXT PRIMARY KEY,
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
    `)
    })
}
export const createCurrentSongTable = () => {
    database.serialize(() => {
        database.run(
        `CREATE TABLE IF NOT EXISTS currentSong (
            id INTEGER PRIMARY KEY,
            song_id TEXT,
            queue_no INTEGER DEFAULT -1,
            FOREIGN KEY (song_id) REFERENCES songs(id)
        );`
        )
    })
}
export const createAllTables = () => {
    createSongTable()
    createLyricsTable()
    createQueueTable()
    createPlaylistTable()
    createMusicPaths()
    createCurrentSongTable()
    fetchSongsFromDatabase()
}
export const dropAllTables = () => {
    dropTable('playlist_song')
    dropTable('playlist')
    dropTable('lyrics')
    dropTable('queue')
    dropTable('currentSong')
    dropTable('songs')
    dropTable('musicPaths')
}


// LYRICS (post/get)
export async function getSongLyricsWithId(id: string){
    const db = new sqlite3.Database(databasePath)
    return new Promise((resolve, reject) => {
        db.get(`SELECT lyric FROM lyrics WHERE song_id = ?`, [id], (err: Error, row: RowLyrics) => {
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
                resolve(row ? row.lyric : "")
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
          src: row.src,
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
        db.run(`INSERT INTO songs (id, title, artist, album, year, genre, imageSrc, duration, src) VALUES (?,?,?,?,?,?,?,?,?)`,
            [songObject.id.replace(/-/g, ''), songObject.tag.tags.title, songObject.tag.tags.artist, songObject.tag.tags.album, songObject.tag.tags.year, songObject.tag.tags.genre, songObject.imageSrc, songObject.duration, songObject.src],
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
export async function clearSongsInDatabase(){
    dropAllTables()
    setTimeout(() => {createAllTables()}, 500)
    return 'Data Deleted'
}

// CURRENT SONG
export const getCurrentSong = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT songs.*, currentSong.queue_no
            FROM currentSong
            JOIN songs ON currentSong.song_id = songs.id
            WHERE currentSong.id = 1
        `
        database.get(query, (err: Error, row: RowCurrentSong) => {
            if (err) {
                reject(err)
            } else {
                if(row){
                const { queue_no, ...song } = row
                resolve({ song, queueNo: queue_no })
                }else{
                    resolve({song: null, queue_no: -1})
                }
            }
        })
    })
}
export const updateCurrentSong = (song_id: string, queue_no: number) => {
    return new Promise((resolve, reject) => {
        const stmt = `
            INSERT INTO currentSong (id, song_id, queue_no)
            VALUES (1, ?, ?)
            ON CONFLICT(id) DO UPDATE SET song_id = excluded.song_id, queue_no = excluded.queue_no
        `;
        database.run(stmt, [song_id, queue_no], function(err: Error) {
            if (err) {
                reject(err);
            } else {
                resolve('Successful');
            }
        });
    });
};



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


// PLAYLISTS
export const getPlaylists = (): Promise<Array<RowPlaylist>> => {
    return new Promise((resolve, reject) => {
        database.all('SELECT * FROM playlist', (err: Error, rows: Array<RowPlaylist>) => {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
        });
    });
};

export const getPlaylistSongs = (id: number): Promise<Array<RowPlaylistSong>> => {
    return new Promise((resolve, reject) => {
        database.all(
        `SELECT songs.* FROM songs
        JOIN playlist_song ON songs.id = playlist_song.song_id
        WHERE playlist_song.playlist_id = ?`,
        [id],
        (err: Error, rows: Array<RowPlaylistSong>) => {
            if (err) {
            reject(err);
            } else {
            resolve(rows);
            }
        }
        );
    });
};

export const addPlaylist = (name: string, defaultImage: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        database.run(
        `INSERT INTO playlist (name, defaultImage) VALUES (?, ?)`,
        [name, defaultImage],
        (err: Error) => {
            if (err) {
            reject(err);
            } else {
                database.get('SELECT last_insert_rowid() as id', [], (err: Error, row: RowPlaylist) => {
                    if (err) {
                        reject(err);
                    } else if (row && row.id) {
                        resolve(row.id);
                    } else {
                        reject(new Error('Unable to get last inserted row id'));
                    }
                });
            }
        }
        );
    });
};

export const deletePlaylist = (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        database.run(
        `DELETE FROM playlist WHERE id = ?`,
        [id],
        (err: Error) => {
            if (err) {
            reject(err);
            } else {
            resolve();
            }
        }
        );
    });
};

export const updatePlaylist = (id: number, name: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        database.run(
        `UPDATE playlist SET name = ? WHERE id = ?`,
        [name, id],
        (err: Error) => {
            if (err) {
            reject(err);
            } else {
            resolve();
            }
        }
        );
    });
};

export const addSongToPlaylist = (songId: string, playlistId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        database.run(
        `INSERT INTO playlist_song (playlist_id, song_id) VALUES (?, ?)`,
        [playlistId, songId],
        (err: Error) => {
            if (err) {
            reject(err);
            } else {
            resolve();
            }
        }
        );
    });
}
export const removeSongFromPlaylist = (songId: string, playlistId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        database.run(
        `DELETE FROM playlist_song WHERE playlist_id = ? AND song_id = ?`,
        [playlistId, songId],
        (err: Error) => {
            if (err) {
            reject(err);
            } else {
            resolve();
            }
        }
        );
    });
};

// MUSIC PATHS
export const insertIntoMusicPath = (musicPath: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        database.run(
        `INSERT INTO musicPaths (path) VALUES (?)`,
        [musicPath],
        (err: Error) => {
            if (err) {
            reject(err)
            } else {
                database.get('SELECT last_insert_rowid() as id', [], (err: Error, row: RowMusicPath) => {
                    if (err) {
                        reject(err)
                    } else if (row && row.id) {
                        resolve(row.id)
                    } else {
                        reject(new Error('Unable to get last inserted row id'))
                    }
                })
            }
        }
        )
    })
}
export const deleteFromMusicPath = (musicPathId: number) : Promise<string> => {
    return new Promise((resolve, reject) => {
        database.run(
        `DELETE FROM musicPaths WHERE id = ?`,
        [musicPathId],
        (err: Error) => {
            if (err) {
            reject(err)
            } else {
                resolve("Successful")
            }
        }
        )
    })
}
export const getMusicPaths = () : Promise<Array<RowMusicPath>> => {
    return new Promise((resolve, reject) => {
        database.all(
        `SELECT * FROM musicPaths`,
        [],
        (err: Error, rows: Array<RowMusicPath>) => {
            if (err) {
            reject(err)
            } else {
                resolve(rows)
            }
        }
        )
    })
}