import { CurrentSongState } from '../contexts/CurrentSongContext'
import { Song } from '../data'

export const currentSongReducer = (currentSong: CurrentSongState,
  action: { type: string, payload: Song | null, index: number, isPlaying?: boolean, audioRef?: HTMLAudioElement | null, reset?: boolean })
  : CurrentSongState => {
  switch (action.type) {
    case 'SET_CURRENT_SONG':
      localStorage.setItem('lastPlayed', JSON.stringify({song: action.payload, index: action.index}))
      if (currentSong.audioRef && action.reset) {
        currentSong.audioRef.currentTime = 0
        return { ...currentSong, song: action.payload, index: action.index, audioRef: action.audioRef ?? currentSong.audioRef, isPlaying: action.isPlaying ?? currentSong.isPlaying }
      }else{
        return { ...currentSong, song: action.payload, index: action.index, isPlaying: action.isPlaying ?? currentSong.isPlaying}
      }
    case 'TOGGLE_CURRENT_SONG_STATE':
      return {...currentSong, isPlaying: action.isPlaying}
    case 'TOGGLE_FAVORITE':
      if(currentSong.song !== null){
        currentSong.song.isFavorite = !currentSong.song.isFavorite
        return currentSong
      }else{
        return currentSong
      }
    case 'CLEAR_CURRENT_SONG':
      localStorage.setItem('lastPlayed', JSON.stringify({song: null, index: -1}))
      if (currentSong.audioRef) {
        currentSong.audioRef.currentTime = 0
        currentSong.audioRef?.pause()
      }
      return { ...currentSong, song: null, index: -1, audioRef: null }
    default:
      return currentSong
  }
}
