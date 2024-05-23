import React from 'react'
import './style.css'

const Settings: React.FC = () => {
  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Settings</h1>
        </div>
        <div className="nav-right">
          <button>Add Files</button>
        </div>
      </nav>
      <div className="settings view">
        <section>
          <h2>Music Library</h2>
          <div className="set-grid">
            <div className="set-cell">
              <h3>Music Location</h3>
              <button>Add Folder</button>
            </div>
            <div className="set-cell">
              <h3>Refresh Music</h3>
              <button>Refresh</button>
            </div>
          </div>
        </section>
        <section>
          <h2>Personlisation</h2>
          <div className="set-grid">
            <div className="set-cell">
              <h3>Change Theme</h3>
              <div className="themes">
                <div className="black"></div>
                <div className="white"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Settings
