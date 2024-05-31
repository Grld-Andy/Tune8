import React, { ReactNode, useReducer, createContext, Dispatch } from 'react';
import { contextMenuReducer } from '../reducers/ContextMenuReducer';
import { Song } from '../data';

interface Props {
  children: ReactNode
}

export interface ContextMenuState {
  isOpen: boolean,
  position: { x: number; y: number },
  lastClicked: Array<Song>
}

interface ContextMenuType {
  contextMenu: ContextMenuState;
  contextMenuDispatch: Dispatch<{ type: string, payload: {x:number, y:number, lastClicked: Array<Song>} }>
}

const initialState: ContextMenuState = {
  isOpen: false,
  position: { x: 0, y: 0 },
  lastClicked: []
};

export const ContextMenuContext = createContext<ContextMenuType>({
  contextMenu: initialState,
  contextMenuDispatch: () => null,
});

const ContextMenuContextProvider: React.FC<Props> = ({ children }) => {
  const [contextMenu, contextMenuDispatch] = useReducer(contextMenuReducer, initialState)

  return (
    <ContextMenuContext.Provider value={{ contextMenu, contextMenuDispatch }}>
      {children}
    </ContextMenuContext.Provider>
  );
};

export default ContextMenuContextProvider
