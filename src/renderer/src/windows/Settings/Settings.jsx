import React from 'react'
import "./Settings.css"

const Settings = ({changeTheme, fetchItems}) => {

    async function addMusicFolder() {
        try {
            const { filePaths } = await window.electron.addMusicDirectory();
            if (filePaths && filePaths.length > 0) {
                console.log('Selected music folder:', filePaths[0]);
                localStorage.setItem("MusicPath", filePaths[0])
            }else{
                console.log("file paths: ", filePaths)
            }
        } catch (error) {
            console.error('Error selecting music folder:', error);
        }
    }

    async function Refresh(){
        fetchItems(true)
        console.log("Refreshing, please wait")
    }
    
    return (
        <div className="settings-window">
            <nav>
                <h1>Settings</h1>
                <h1 onClick={showNowPlaying}
                style={{cursor: "pointer" }}
                id='now_playing456'>
                    Now Playing
                </h1>
            </nav>
            <div className="nav_space"></div>
            <section>
                <h2>Music Library</h2>
                <div className="set-grid">
                    <div className="set-cell">
                        <h3>Music Location</h3>
                        <button onClick={addMusicFolder}>Add Folder</button>
                    </div>
                    <div className="set-cell">
                        <h3>Refresh Music</h3>
                        <button onClick={Refresh}>
                            Refresh
                        </button>
                    </div>
                </div>
            </section>
            <section>
                <h2>Personalisation</h2>
                <div className="set-grid">
                    <div className="set-cell">
                        <h3>Change Theme</h3>
                        <div className="themes">
                            <div className="black" onClick={() => {changeTheme("dark")}}></div>
                            <div className="white"  onClick={() => {changeTheme("light")}}></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Settings