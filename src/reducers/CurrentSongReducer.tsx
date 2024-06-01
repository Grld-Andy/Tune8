import { CurrentSongState } from '../contexts/CurrentSongContext'
import { Song } from '../data'

export const currentSongReducer = (currentSong: {song: Song|null, index: number}, action: {type: string, payload: Song | null, index: number}): CurrentSongState => {
  switch (action.type) {
    case 'SET_CURRENT_SONG':
      localStorage.setItem('lastPlayed', JSON.stringify({song: action.payload, index: action.index}))
      return {song: action.payload, index: action.index}
    case 'TOGGLE_FAVORITE':
      if(currentSong.song !== null){
        currentSong.song.isFavorite = !currentSong.song.isFavorite
        return currentSong
      }else{
        return currentSong
      }
    case 'CLEAR_CURRENT_SONG':
      localStorage.setItem('lastPlayed', JSON.stringify({song: null, index: -1}))
      return {song: null, index: -1}
    default:
      return currentSong
  }
}
