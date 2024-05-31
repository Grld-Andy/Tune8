import { ContextMenuState } from '../contexts/ContextMenuContext'
import { Song } from '../data';

export const contextMenuReducer = (contextMenu: ContextMenuState, action: {type: string,payload: { x: number, y: number, lastClicked: Array<Song> }}): ContextMenuState => {
  switch (action.type) {
    case 'OPEN_MENU':
      console.log(action.payload.lastClicked)
      return {
        ...contextMenu,
        isOpen: true,
        position: action.payload || {x: 0, y: 0},
        lastClicked: action.payload.lastClicked
      }
    case 'CLOSE_MENU':
      return {
        ...contextMenu,
        isOpen: false
      }
    default:
      return contextMenu
  }
};
