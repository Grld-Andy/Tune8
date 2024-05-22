"use strict";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
if (typeof electron === "string") {
  throw new TypeError("Not running in an Electron environment!");
}
const { env } = process;
const isEnvSet = "ELECTRON_IS_DEV" in env;
const getFromEnv = Number.parseInt(env.ELECTRON_IS_DEV, 10) === 1;
const isDev = isEnvSet ? getFromEnv : !electron.app.isPackaged;
let win;
const sqlite3 = require("sqlite3").verbose();
const database = new sqlite3.Database("./database.db");
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
    `);
});
async function handleDirectoryOpen() {
  try {
    const result = await electron.dialog.showOpenDialog({ properties: ["openDirectory"] });
    if (!result.canceled) {
      return { filePaths: result.filePaths };
    } else {
      return { filePaths: [] };
    }
  } catch (error) {
    console.error("Error selecting music directory:", error);
  }
}
electron.ipcMain.handle("fetch-database-data", async (event) => {
  try {
    const data = await fetchMusicdataFromDatabase();
    return data;
  } catch (error) {
    console.error("Error fetching data from database:", error);
    throw error;
  }
});
async function fetchMusicdataFromDatabase() {
  try {
    const db = new sqlite3.Database("./database.db");
    let rows = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM songs", (err, rows2) => {
        if (err) {
          reject(err);
        } else {
          db.close((err2) => {
            if (err2) {
              console.error("An error occured");
            } else {
              console.log("Database closed succefully");
            }
          });
          resolve(rows2);
        }
      });
    });
    return rows.map((row) => ({
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
    }));
  } catch (error) {
    console.error("Error fetching data from database:", error);
    throw error;
  }
}
electron.ipcMain.handle("insert-songs-into-database", async (event, dataArray) => {
  try {
    await insertAllMusicDataIntoDatabase(dataArray);
    return true;
  } catch (error) {
    console.error(`Error inserting into database: ${error}`);
    return false;
  }
});
async function insertAllMusicDataIntoDatabase(dataArray) {
  return new Promise((resolve, reject) => {
    const placeholders = dataArray.map(() => "(?, ?, ?, ?, ?, ?, ?, ?)").join(", ");
    const values = dataArray.flatMap((data) => [
      data.tag.tags.title,
      data.tag.tags.artist,
      data.tag.tags.album,
      data.tag.tags.year,
      data.tag.tags.genre,
      data.imageSrc,
      data.duration,
      data.url
    ]);
    const db = new sqlite3.Database("./database.db");
    db.run(`INSERT INTO songs (title, artist, album, year, genre, imageSrc, duration, url) VALUES ${placeholders}`, values, function(err) {
      if (err) {
        reject(err);
      } else {
        db.close((err2) => {
          if (err2) {
            console.error(err2.message);
          } else {
            console.log("Database connection closed.");
          }
        });
        resolve(this.lastID);
      }
    });
  });
}
electron.ipcMain.handle("fetch-single-song", async (event, { data }) => {
  try {
    const song = await getSingleSong(data);
    return song;
  } catch (error) {
    console.error("Error fetching single song from database:", error);
    return null;
  }
});
async function getSingleSong(data) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM songs WHERE title = ? AND artist = ? AND album = ? LIMIT 1";
    const db = new sqlite3.Database("./database.db");
    db.get(query, [data.title, data.artist, data.album], (err, row) => {
      if (err) {
        reject(err);
      } else {
        db.close((err2) => {
          if (err2) {
            console.error(err2.message);
          } else {
            console.log("Database connection closed.");
          }
        });
        resolve(row);
      }
    });
  });
}
async function toggleFavorites(data) {
  return new Promise((resolve, reject) => {
    const toggleTo = data.newValue === 0 ? 0 : 1;
    const db = new sqlite3.Database("./database.db");
    db.run("UPDATE songs SET isFavorite = ? WHERE id = ?", [toggleTo, data.songToToggle.id], function(err) {
      if (err) {
        reject(err);
      } else {
        db.close((err2) => {
          if (err2) {
            console.error(err2.message);
          } else {
            console.log("Database connection closed.");
          }
        });
        resolve(toggleTo);
      }
    });
  });
}
electron.ipcMain.handle("toggle-favorite", async (event, data) => {
  try {
    await toggleFavorites(data);
    return data.newValue === 0 ? 0 : 1;
  } catch (error) {
    console.error("Error updating database: ", error);
    return -1;
  }
});
electron.ipcMain.handle("update-last-played", async (event, data) => {
  try {
    await updateLastPlayed(data);
    return true;
  } catch (error) {
    return false;
  }
});
async function updateLastPlayed(data) {
  return new Promise((resolve, reject) => {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const db = new sqlite3.Database("./database.db");
    db.run("UPDATE songs SET lastPlayed = ? WHERE id = ?", [timestamp, data.id], function(err) {
      if (err) {
        reject(err);
      } else {
        db.close((err2) => {
          if (err2) {
            console.error(err2.message);
          } else {
            console.log("Database connection closed.");
          }
        });
        resolve("Updated successfully");
      }
    });
  });
}
electron.ipcMain.handle("update-database", async (event, data) => {
  try {
    await updateDatabase(data);
    return true;
  } catch (error) {
    console.error("Error updating database:", error);
    return false;
  }
});
async function updateDatabase(data) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./database.db");
    db.run("UPDATE songs SET title = ? WHERE id = ?", [data.title, data.id], function(err) {
      if (err) {
        reject(err);
      } else {
        db.close((err2) => {
          if (err2) {
            console.error(err2.message);
          } else {
            console.log("Database connection closed.");
          }
        });
        resolve();
      }
    });
  });
}
const handleToggleAlwaysOnTop = () => {
  const win2 = electron.BrowserWindow.getFocusedWindow();
  if (win2) {
    const newIsAlwaysOnTop = !win2.isAlwaysOnTop();
    win2.setAlwaysOnTop(newIsAlwaysOnTop, "floating");
    win2.setSize(newIsAlwaysOnTop ? 300 : 1200, newIsAlwaysOnTop ? 250 : 800);
    win2.setResizable(newIsAlwaysOnTop ? false : true);
    win2.frame = !newIsAlwaysOnTop;
  }
};
electron.ipcMain.on("toggle-always-on-top", (event, args) => {
  handleToggleAlwaysOnTop();
});
electron.ipcMain.on("create-directory", (event, directoryPath) => {
  try {
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log(`Directory created: ${directoryPath}`);
    event.returnValue = true;
  } catch (error) {
    console.error(`Error creating directory: ${directoryPath}`, error);
    event.returnValue = false;
  }
});
function createWindow() {
  win = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    title: "Tune8",
    backgroundColor: "white",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path__namespace.join(__dirname, "../preload/preload.js")
    }
  });
  win.loadURL(
    isDev ? "http://localhost:5173" : `file://${path__namespace.join(__dirname, "../build/index.html")}`
  );
  win.on("closed", () => win = null);
  win.once("ready-to-show", () => win.show());
}
electron.app.on("ready", () => {
  electron.protocol.interceptFileProtocol("file", (request, callback) => {
    const url = request.url.substr(7);
    callback({ path: url });
  });
  electron.ipcMain.handle("dialog:openDirectory", handleDirectoryOpen);
  createWindow();
});
