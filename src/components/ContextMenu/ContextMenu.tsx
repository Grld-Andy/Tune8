import React from 'react'
import './style.css'
const ContextMenu: React.FC = () => {
  return (
    <div className='context-menu'>
        <div className="labels">
            <h2 className='start-context'>Play Now</h2>
            <h2>Play Next</h2>
            <h2 className='to-sub'>
                Add to...
                <div className='submenu'>
                    <h2 className='start-context'>Queue</h2>
                    <h2>Playlist</h2>
                    <h2 className='end-context'>Favorites</h2>
                </div>
            </h2>
            <h2 className='to-sub end-context'>View ...
                <div className='submenu'>
                    <h2 className='start-context'>Artist</h2>
                    <h2 className='end-context'>Album</h2>
                </div>
            </h2>
        </div>
    </div>
  )
}

export default ContextMenu
