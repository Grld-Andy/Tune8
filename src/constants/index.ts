import { Song } from "../data"

export const alphabets : string[] = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i))

const convertToSeconds: (t:string) => number = (time: string) => {
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
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}` :
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
export const TotalDuration: (s:Song[]) => string = (songs: Song[]) => {
    let totalTime = 0
    songs.forEach((song) => {
        totalTime += convertToSeconds(song.duration)
    })
    return DurationToString(totalTime)
}