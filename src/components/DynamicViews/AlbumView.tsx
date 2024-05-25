import React from 'react'
import { Outlet } from 'react-router-dom'

const AlbumView: React.FC = () => {
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default AlbumView
