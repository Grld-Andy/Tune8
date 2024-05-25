import React from 'react'
import './style.css'
import { alphabets } from '../../constants'
import { SortedSongs } from '../../data'

interface Props{
    toggleShowNav: () => void,
    object: SortedSongs,
    closeAndScroll: () => void
}

const MusicNavigation: React.FC<Props> = ({toggleShowNav, object, closeAndScroll}) => {
  return (
    <div className="songs-nav" onClick={toggleShowNav}>
        {
            alphabets.map(letter => (
                object[letter] && object[letter].size > 0 ?
                <a key={`nav-${letter}`} href={`#${letter}`} className='open' onClick={closeAndScroll}>{letter}</a> :
                <a key={`nav-${letter}`} className='closed'>{letter}</a> 
            ))
        }
    </div>
  )
}

export default MusicNavigation
