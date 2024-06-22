import { Song, SortedSongs } from "../data"

export const alphabets : string[] = ['#'].concat(Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)))

export const convertToSeconds: (t:string) => number = (time: string) => {
    let [minutes, seconds]:number[] = time.split(':').map(Number)
    if(isNaN(minutes) || isNaN(seconds)){
        minutes = 0
        seconds = 0
    }
    return (minutes*60) + seconds
}
export const DurationToString = (totalSeconds:number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return hours > 0 ?
        `${String(Math.trunc(hours)).padStart(2, '0')}:${String(Math.trunc(minutes)).padStart(2, '0')}:${String(Math.trunc(seconds)).padStart(2, '0')}` :
        `${String(Math.trunc(minutes)).padStart(2, '0')}:${String(Math.trunc(seconds)).padStart(2, '0')}`
}
export const TotalDuration: (s:Song[]) => string = (songs: Song[]) => {
    let totalTime = 0
    songs.forEach((song) => {
        totalTime += convertToSeconds(song.duration)
    })
    return DurationToString(totalTime)
}
export function shuffleArray(array: Array<Song>): Array<Song> {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
}

// get sorted songs
export const getSortedSongs = (songs: Array<Song>, sortOrder: string, page: string = ''): SortedSongs => {
    const sortedSongs: SortedSongs = {}
    songs.forEach(song => {
      // sort by title
        if(sortOrder === 'title'){
          let firstLetter:string = song.tag.tags.title.charAt(0).toUpperCase()
          firstLetter = /^[A-Za-z]$/.test(firstLetter) ? firstLetter : '#'
          if (!sortedSongs[firstLetter]) {
            sortedSongs[firstLetter] = new Set()
          }
          sortedSongs[firstLetter].add(song)
        }
        // sort by album
        else if(sortOrder === 'album'){
          let firstLetter:string = song.tag.tags.album.charAt(0).toUpperCase()
          firstLetter = /^[A-Za-z]$/.test(firstLetter) ? firstLetter : '#'
          if (!sortedSongs[firstLetter]) {
            sortedSongs[firstLetter] = new Set()
          }
          if(page === 'albums' && !Array.from(sortedSongs[firstLetter]).some(elem => elem.tag.tags.album === song.tag.tags.album)){
            sortedSongs[firstLetter].add(song)
          }
          else if(page === ''){
            sortedSongs[firstLetter].add(song)
          }
        }
        // sort by artist
        else if(sortOrder === 'artist'){
          let firstLetter:string = song.tag.tags.artist.charAt(0).toUpperCase()
          firstLetter = /^[A-Za-z]$/.test(firstLetter) ? firstLetter : '#'
          if (!sortedSongs[firstLetter]) {
            sortedSongs[firstLetter] = new Set()
          }
          if(page === 'albums' && !Array.from(sortedSongs[firstLetter]).some(elem => elem.tag.tags.album === song.tag.tags.album)){
            sortedSongs[firstLetter].add(song)
          }
          else if(page === ''){
            sortedSongs[firstLetter].add(song)
          }
        }
        // sort by year
        else if(sortOrder === 'year'){
          const year: string = song.tag.tags.year.toString()
          if (!sortedSongs[year]) {
            sortedSongs[year] = new Set()
          }
          if(page === 'albums' && !Array.from(sortedSongs[year]).some(elem => elem.tag.tags.album === song.tag.tags.album)){
            sortedSongs[year].add(song)
          }
          else if(page === ''){
            sortedSongs[year].add(song)
          }
        }
    })
    return sortedSongs
}

// const add music folder
export const addMusicFolder = async() => {
  try {
    const filePaths = await window.ipcRenderer.addMusicDirectory()
    if (filePaths && filePaths.length > 0) {
      localStorage.setItem("MusicPaths", filePaths[0])
    }else{
        console.log('error')
    }
  } catch (error) {
      console.error(error)
  }
}