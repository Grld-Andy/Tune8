import React from 'react'
import './style.css'
import { alphabets } from '../../utilities'
import { SortedSongs } from '../../data'

interface Props{
    toggleShowNav: () => void,
    object: SortedSongs,
    closeAndScroll: () => void,
    sortOrder?: string
}

const MusicNavigation: React.FC<Props> = ({toggleShowNav, object, closeAndScroll, sortOrder = ''}) => {
  return (
    <div className="songs-nav" onClick={toggleShowNav}>
        {
          sortOrder !== 'year' &&
            alphabets.map(letter => (
                object[letter] && object[letter].size > 0 ?
                <a key={`nav-${letter}`} href={`#${letter}`} className='open' onClick={closeAndScroll}>{letter}</a> :
                <a key={`nav-${letter}`} className='closed'>{letter}</a> 
            ))
        }
        {
          sortOrder === 'year' &&
          Object.keys(object).map(year => (
            object[year] && object[year].size > 0 ?
            <a key={`nav-${year}`} href={`#${year}`} className='open' onClick={closeAndScroll}>{year}</a> :
            <a key={`nav-${year}`} className='closed'>{year}</a> 
          ))
        }
    </div>
  )
}

export default MusicNavigation
