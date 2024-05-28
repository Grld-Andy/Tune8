import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import ThemeContextProvider from './contexts/ThemeContext.tsx'
import CurrentSongContextProvider from './contexts/CurrentSongContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeContextProvider>
    <CurrentSongContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </CurrentSongContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
