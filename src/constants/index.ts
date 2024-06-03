import { Song } from "../data"

export const alphabets : string[] = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i))

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
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}