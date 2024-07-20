import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { HashRouter } from 'react-router-dom'
import './index.css'
import ThemeContextProvider from './contexts/ThemeContext.tsx'
import CurrentSongContextProvider from './contexts/CurrentSongContext.tsx'
import QueueSongsContextProvider from './contexts/QueueSongsContext.tsx'
import ContextMenuContextProvider from './contexts/ContextMenuContext.tsx'
import { FavoritesContextProvider } from './contexts/FavoritesContext.tsx'
import PlaylistsContextProvider from './contexts/PlaylistsContext.tsx'
import PlaylistFormContextProvider from './contexts/PlaylistFormContext.tsx'
import AllSongsContextProvider from './contexts/AllSongsContext.tsx'
import SearchContextProvider from './contexts/SearchContext.tsx'
import FeedbackContextProvider from './contexts/FeedbackContext.tsx'
import SongFormContextProvider from './contexts/SongFormContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <ContextMenuContextProvider>
        <AllSongsContextProvider>
          <FeedbackContextProvider>
            <QueueSongsContextProvider>
              <FavoritesContextProvider>
                <PlaylistFormContextProvider>
                  <SearchContextProvider>
                    <SongFormContextProvider>
                      <PlaylistsContextProvider>
                        <CurrentSongContextProvider>
                          <HashRouter>
                            <App />
                          </HashRouter>
                        </CurrentSongContextProvider>
                      </PlaylistsContextProvider>
                    </SongFormContextProvider>
                  </SearchContextProvider>
                </PlaylistFormContextProvider>
              </FavoritesContextProvider>
            </QueueSongsContextProvider>
          </FeedbackContextProvider>
        </AllSongsContextProvider>
      </ContextMenuContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
