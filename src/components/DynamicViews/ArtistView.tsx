import React from 'react'
import { Outlet } from 'react-router-dom'

const ArtistView: React.FC = () => {
  return (
    <div className='dynamic-page'>
      <Outlet/>
    </div>
  )
}

export default ArtistView
