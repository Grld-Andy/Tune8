import React from 'react'
import { Outlet } from 'react-router-dom'

const PlaylistView: React.FC = () => {
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default PlaylistView
