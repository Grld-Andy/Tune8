import { ContextMenuState } from '../contexts/ContextMenuContext'
import { Song } from '../data';

export const contextMenuReducer = (contextMenu: ContextMenuState, action: {type: string,payload: { x: number, y: number, lastClicked: Array<Song>, indexClicked?: number, nameClicked?: string }}): ContextMenuState => {
  switch (action.type) {
    case 'OPEN_MENU':
      return {
        ...contextMenu,
        isOpen: true,
        position: action.payload || {x: 0, y: 0},
        lastClicked: action.payload.lastClicked,
        indexClicked: action.payload.indexClicked,
        nameClicked: action.payload.nameClicked
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
