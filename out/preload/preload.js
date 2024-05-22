"use strict";
const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs").promises;
const path = require("path");
const mm = require("music-metadata");
const { promisify } = require("util");
const { resolve } = require("path");
require("process");
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const musicLocation = localStorage.getItem("MusicPath");
const music_folder = musicLocation ? localStorage.getItem("MusicPath") : "";
const songsSavedData = "C:\\Music_Data\\songsSavedData";
const queueSavedData = "C:\\Music_Data\\queueSavedData";
const lyricsSavedData = "C:\\Music_Data\\lyrics";
function writeTime(time) {
  return time < 10 ? `0${time}` : time;
}
async function createFoldersIfNotExist() {
  const foldersToCreate = [songsSavedData, queueSavedData, lyricsSavedData];
  for (const folder of foldersToCreate) {
    if (!fs.existsSync(folder)) {
      try {
        await fs.mkdir(folder, { recursive: true });
        console.log(`Folder created: ${folder}`);
      } catch (error) {
        console.error(`Error creating folder ${folder}:`, error);
      }
    }
  }
}
function createDirectoryIfNotExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    try {
      fs.mkdirSync(directoryPath, { recursive: true });
      console.log(`Directory created: ${directoryPath}`);
    } catch (error) {
      console.error(`Error creating directory: ${directoryPath} - ${error}`);
    }
  } else {
    console.log(`Directory already exists: ${directoryPath}`);
  }
}
async function deleteFilesInFolder(folderPath) {
  try {
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      await fs.unlink(filePath);
      console.log(`Deleted ${file}`);
    }
  } catch (err) {
    console.error("Error deleting files:", err);
  }
}
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.reduce((a, f) => a.concat(f), []);
}
async function insertAllMusicDataIntoDatabase(dataArray) {
  try {
    await ipcRenderer.invoke("insert-songs-into-database", dataArray);
    return true;
  } catch (error) {
    console.error(`Error inserting into database: ${error}`);
    return false;
  }
}
async function saveDataToFile(data, savePath, FileName = "musicData_") {
  setTimeout(async () => {
    const chunks = Math.ceil(data.length / 20);
    for (let i = 0; i < chunks; i++) {
      const start = i * 20;
      const end = (i + 1) * 20;
      const chunkData = data.slice(start, end);
      const fileName = `${FileName}${i + 1}.json`;
      const filePath = path.join(savePath, fileName);
      try {
        console.log("saving queue: ", i);
        await fs.writeFile(filePath, JSON.stringify(chunkData, null, 2));
      } catch (error) {
        console.error(`Error saving ${fileName}:`, error);
      }
    }
  }, 5);
}
async function readFromFile(savePath, single = false) {
  const files = await fs.readdir(savePath);
  if (files.length === 0) {
    return [];
  }
  const jsonFiles = files.filter((file) => file.endsWith(".json"));
  if (jsonFiles.length > 0) {
    const musicData = [];
    for (const file of jsonFiles) {
      const filePath = path.join(savePath, file);
      const jsonData = await fs.readFile(filePath, "utf-8");
      const parsedData = JSON.parse(jsonData);
      musicData.push(...parsedData);
    }
    musicData.sort((a, b) => a.tag.tags.album.localeCompare(b.tag.tags.album));
    return musicData;
  } else {
    return [];
  }
}
function processLyrics(lyrics) {
  let lines = lyrics.split(/\n\n|\n|\r\n/);
  lines.shift();
  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].trim();
    if (lines[i].startsWith("[") && i != 0) {
      lines[i] = `</br><p>${lines[i]}.</p>`;
    } else {
      lines[i] = `<p>${lines[i]}.</p>`;
    }
  }
  let formattedLyrics = lines.join("");
  return formattedLyrics;
}
const convertImagesToBase64 = async () => {
  const imageFolderPath = "src/renderer/public/my_images/placeholders/music";
  try {
    const imageFiles = await fs.readdir(imageFolderPath);
    const imageBase64Array = await Promise.all(imageFiles.map(async (imageFile) => {
      const imagePath = path.join(imageFolderPath, imageFile);
      const imageBuffer = await fs.readFile(imagePath);
      const imageBase64 = imageBuffer.toString("base64");
      return `data:image/png;base64,${imageBase64}`;
    }));
    return imageBase64Array;
  } catch (error) {
    console.error("Error converting images to base64:", error);
    return [];
  }
};
contextBridge.exposeInMainWorld("electron", {
  makeMini: () => {
    ipcRenderer.send("toggle-always-on-top");
  },
  fetchDataFromDatabase: async () => {
    try {
      const data = await ipcRenderer.invoke("fetch-database-data");
      return data;
    } catch (error) {
      console.error("Error fetching data from database:", error);
      throw error;
    }
  },
  saveLastPlayed: async (song) => {
    try {
      const result = await ipcRenderer.invoke("update-last-played", song);
      return result;
    } catch (error) {
      console.error("Error updating song");
      throw error;
    }
  },
  favoritesToggle: async (song) => {
    try {
      const result = await ipcRenderer.invoke("toggle-favorite", song);
      if (result === -1) {
        console.error("Failed to make changes");
        throw "Failed to make changes to database";
      } else {
        return result;
      }
    } catch (error) {
      console.error("Error updating database: ", error);
      throw error;
    }
  },
  createFolders: () => {
    createFoldersIfNotExist();
  },
  playSong: (songUrl) => {
    ipcRenderer.send("play-song", songUrl);
  },
  saveQueue: async (queue) => {
    try {
      console.log("Deleted old queue data");
    } catch (error) {
      console.error("Error deleting old queue data:", error);
    }
    setTimeout(async () => {
      try {
        await deleteFilesInFolder(queueSavedData);
        await saveDataToFile(queue, queueSavedData, "queueData_");
        console.log("Saving queue data");
        return true;
      } catch (error) {
        console.error("Error saving queue data:", error);
        return false;
      }
    }, 200);
  },
  readQueue: async () => {
    try {
      const musicData = await readFromFile(queueSavedData);
      return musicData;
    } catch (error) {
      console.error("Error reading from file: ", error);
    }
  },
  getLyrics: async (song) => {
    try {
      const lyricsFileName = `${song.tag.tags.title}.json`;
      const lyricsFolderPath = path.join(lyricsSavedData, song.tag.tags.album);
      createDirectoryIfNotExists(lyricsFolderPath);
      const lyricsFilePath = path.join(lyricsFolderPath, lyricsFileName);
      let lyricsFileContent = "";
      try {
        lyricsFileContent = await fs.readFile(lyricsFilePath, "utf8");
      } catch (readError) {
      }
      if (lyricsFileContent) {
        return processLyrics(lyricsFileContent);
      } else {
        console.log(song.tag.tags.title.split("|")[0]);
        const response = await fetch(
          `https://api.lyrics.ovh/v1/${song.tag.tags.artist}/${song.tag.tags.title.split("|")[0].split("ft")[0]}`
        );
        const data = await response.json();
        if (data.lyrics !== void 0) {
          lyricsFileContent = data.lyrics;
          if (!lyricsFileContent) {
            lyricsFileContent = "Not found";
          }
          await fs.writeFile(lyricsFilePath, lyricsFileContent, "utf8");
          return lyricsFileContent;
        } else {
          return "Not found";
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      return "Not found";
    }
  },
  addMusicDirectory: async () => {
    try {
      const directoryPath = await ipcRenderer.invoke("dialog:openDirectory");
      return directoryPath;
    } catch (error) {
      console.error("Error selecting music directory:", error);
      throw error;
    }
  },
  getDirectoryContents: async (clearAll) => {
    try {
      if (clearAll) {
        await deleteFilesInFolder(songsSavedData);
      }
      const musicData = new Set(await ipcRenderer.invoke("fetch-database-data"));
      if (musicData.size > 0) {
        console.log("music Data: ", musicData);
        return Array.from(musicData);
      }
      const imagesBase64 = await convertImagesToBase64();
      const songsPath = await getFiles(music_folder);
      const mp3Files = songsPath.filter((song) => path.extname(song) === ".mp3");
      let index = 0;
      for (const filePath of mp3Files) {
        const metadata = await mm.parseFile(filePath);
        const duration = metadata.format.duration;
        const imageSrc = metadata.common.picture && metadata.common.picture.length > 0 ? `data:${metadata.common.picture[0].format};base64,${metadata.common.picture[0].data.toString("base64")}` : imagesBase64[index % imagesBase64.length];
        const songTitle = metadata.common.title ? metadata.common.title : path.basename(filePath).split(".mp3")[0];
        const songAlbum = metadata.common.album ? metadata.common.album : `Unknown Album`;
        const songYear = metadata.common.year ? metadata.common.year : `#`;
        const musicDataObject = {
          url: `/songs/${encodeURIComponent(path.basename(filePath))}`,
          tag: {
            tags: {
              title: songTitle,
              artist: metadata.common.artist ? metadata.common.artist : `Unknown Artist`,
              album: songAlbum,
              year: songYear,
              genre: metadata.common.genre ? metadata.common.genre[0] : `#`
            }
          },
          imageSrc,
          duration: duration ? `${writeTime(Math.floor(duration / 60))}:${writeTime(Math.floor(duration % 60))}` : "1:00",
          location: "songs"
        };
        musicData.add(musicDataObject);
        index += 1;
        console.log(index);
      }
      await insertAllMusicDataIntoDatabase(Array.from(musicData));
      return Array.from(musicData);
    } catch (error) {
      console.error("Error reading directory:", error);
      return [];
    }
  }
});
