import { Song } from '../data'

export const currentSongReducer = (currentSong: Song | null, action: {type: string, payload: Song | null}): Song | null => {
  switch (action.type) {
    case 'SET_CURRENT_SONG':
      return action.payload
    default:
      return currentSong
  }
}
