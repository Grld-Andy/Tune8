import { Song } from '../data'

export const currentSongReducer = (currentSong: Song | null, action: {type: string, payload: Song | null}): Song | null => {
  switch (action.type) {
    case 'SET_CURRENT_SONG':
      localStorage.setItem('lastPlayed', JSON.stringify(action.payload))
      return action.payload
    case 'TOGGLE_FAVORITE':
      return currentSong !== null 
        ? {...currentSong, isFavorite: !currentSong.isFavorite}
        : currentSong
    case 'CLEAR_CURRENT_SONG':
      localStorage.setItem('lastPlayed', JSON.stringify(null))
      return null
    default:
      return currentSong
  }
}
