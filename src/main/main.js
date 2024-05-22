import {app, BrowserWindow, ipcMain, dialog, protocol} from 'electron'
import * as path from 'path'
import isDev from 'electron-is-dev'
import fs from 'fs'
let win
const sqlite3 = require('sqlite3').verbose()

const database = new sqlite3.Database('./database.db');
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

async function handleDirectoryOpen() {
    try {
        const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
        if (!result.canceled) {
            return { filePaths: result.filePaths };
        } else {
            return { filePaths: [] };
        }
    } catch (error) {
        console.error('Error selecting music directory:', error);
    }
}
ipcMain.handle('fetch-database-data', async (event) => {
    try {
        const data = await fetchMusicdataFromDatabase();
        return data;
    } catch (error) {
        console.error('Error fetching data from database:', error);
        throw error;
    }
});
async function fetchMusicdataFromDatabase() {
    try {
        const db = new sqlite3.Database('./database.db')
        let rows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM songs', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    db.close((err) => {
                        if(err){
                            console.error('An error occured')
                        }
                        else{
                            console.log('Database closed succefully')
                        }
                    })
                    resolve(rows);
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
        console.error('Error fetching data from database:', error);
        throw error;
    }
}
ipcMain.handle('insert-songs-into-database', async (event, dataArray) => {
    try {
        await insertAllMusicDataIntoDatabase(dataArray);
        return true;
    } catch (error) {
        console.error(`Error inserting into database: ${error}`);
        return false;
    }
})

async function insertAllMusicDataIntoDatabase(dataArray) {
    return new Promise((resolve, reject) => {
        const placeholders = dataArray.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
        const values = dataArray.flatMap(data => [
            data.tag.tags.title,
            data.tag.tags.artist,
            data.tag.tags.album,
            data.tag.tags.year,
            data.tag.tags.genre,
            data.imageSrc,
            data.duration,
            data.url
        ]);
        
        const db = new sqlite3.Database('./database.db')
        db.run(`INSERT INTO songs (title, artist, album, year, genre, imageSrc, duration, url) VALUES ${placeholders}`, values, function (err) {
            if (err) {
                reject(err);
            } else {
                db.close((err) => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                })
                resolve(this.lastID);
            }
        })
    })
}

ipcMain.handle('fetch-single-song', async (event, { data }) => {
    try {
        const song = await getSingleSong(data);
        return song;
    } catch (error) {
        console.error('Error fetching single song from database:', error);
        return null;
    }
})
async function getSingleSong(data){
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM songs WHERE title = ? AND artist = ? AND album = ? LIMIT 1';
        const db = new sqlite3.Database('./database.db')
        db.get(query, [data.title, data.artist, data.album], (err, row) => {
            if (err) {
                reject(err);
            } else {
                db.close((err) => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                })
                resolve(row);
            }
        })
    })
}
async function toggleFavorites(data) {
    return new Promise((resolve, reject) => {
        const toggleTo = data.newValue === 0 ? 0 : 1;
        const db = new sqlite3.Database('./database.db')
        db.run('UPDATE songs SET isFavorite = ? WHERE id = ?', [toggleTo, data.songToToggle.id], function(err) {
            if (err) {
                reject(err);
            } else {
                db.close((err) => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                })
                resolve(toggleTo);
            }
        })
    })
}
ipcMain.handle('toggle-favorite', async (event, data) => {
    try{
        await toggleFavorites(data)
        return data.newValue === 0 ? 0 : 1
    }catch (error){
        console.error('Error updating database: ', error)
        return -1
    }
})
ipcMain.handle('update-last-played', async (event, data) => {
    try {
        await updateLastPlayed(data)
        return true
    } catch (error) {
        return false
    }
});
async function updateLastPlayed(data) {
    return new Promise((resolve, reject) => {
        const timestamp = new Date().toISOString();
        const db = new sqlite3.Database('./database.db')
        db.run('UPDATE songs SET lastPlayed = ? WHERE id = ?', [timestamp, data.id], function (err) {
            if (err) {
                reject(err);
            } else {
                db.close((err) => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                })
                resolve("Updated successfully")
            }
        })
    })
}
ipcMain.handle('update-database', async (event, data) => {
    try {
        await updateDatabase(data);
        return true
    } catch (error) {
        console.error('Error updating database:', error);
        return false
    }
});

async function updateDatabase(data) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./database.db')
        db.run('UPDATE songs SET title = ? WHERE id = ?', [data.title, data.id], function(err) {
            if (err) {
                reject(err);
            } else {
                db.close((err) => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                })
                resolve();
            }
        });
    });
}
const handleToggleAlwaysOnTop = () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        const newIsAlwaysOnTop = !win.isAlwaysOnTop();
        win.setAlwaysOnTop(newIsAlwaysOnTop, 'floating');
        win.setSize(newIsAlwaysOnTop ? 300 : 1200, newIsAlwaysOnTop ? 250 : 800);
        win.setResizable(newIsAlwaysOnTop ? false : true)
        win.frame = !newIsAlwaysOnTop
        // win.setPosition(win.getPosition()[0] + (newIsAlwaysOnTop ? 900 : -900), win.getPosition()[1]);
    }
};
ipcMain.on('toggle-always-on-top', (event, args) => {
    handleToggleAlwaysOnTop();
});
ipcMain.on('create-directory', (event, directoryPath) => {
    try {
        fs.mkdirSync(directoryPath, { recursive: true });
        console.log(`Directory created: ${directoryPath}`);
        event.returnValue = true;
    } catch (error) {
        console.error(`Error creating directory: ${directoryPath}`, error);
        event.returnValue = false;
    }
})

function createWindow(){
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        title: 'Tune8',
        backgroundColor: "white",
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "../preload/preload.js")
        }
    })

    win.loadURL(
        isDev 
        ?"http://localhost:5173"
        : `file://${path.join(__dirname, '../build/index.html')}`)
    // win.loadFile(path.join(__dirname, '../renderer/index.html'))
    win.on('closed', () => win = null)
    win.once('ready-to-show', () => win.show())
}

app.on('ready', () => {
    protocol.interceptFileProtocol('file', (request, callback) => {
        const url = request.url.substr(7);
        callback({ path: url });
    });

    ipcMain.handle('dialog:openDirectory', handleDirectoryOpen);

    createWindow();
});