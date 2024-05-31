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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeContextProvider>
    <ContextMenuContextProvider>
    <QueueSongsContextProvider>
    <FavoritesContextProvider>
    <CurrentSongContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </CurrentSongContextProvider>
    </FavoritesContextProvider>
    </QueueSongsContextProvider>
    </ContextMenuContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
