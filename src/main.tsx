import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import ThemeContextProvider from './contexts/ThemeContext.tsx'
import CurrentSongContextProvider from './contexts/CurrentSongContext.tsx'
import QueueSongsContextProvider from './contexts/QueueSongsContext.tsx'
import ContextMenuContextProvider from './contexts/ContextMenuContext.tsx'
import { FavoritesContextProvider } from './contexts/FavoritesContext.tsx'
import PlaylistsContextProvider from './contexts/PlaylistsContext.tsx'
import PlaylistFormContextProvider from './contexts/PlaylistFormContext.tsx'
import AllSongsContextProvider from './contexts/AllSongsContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <ContextMenuContextProvider>
        <AllSongsContextProvider>
          <QueueSongsContextProvider>
            <FavoritesContextProvider>
              <PlaylistFormContextProvider>
              <PlaylistsContextProvider>
                <CurrentSongContextProvider>
                  <BrowserRouter>
                    <App />
                  </BrowserRouter>
                </CurrentSongContextProvider>
              </PlaylistsContextProvider>
              </PlaylistFormContextProvider>
            </FavoritesContextProvider>
          </QueueSongsContextProvider>
        </AllSongsContextProvider>
      </ContextMenuContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
