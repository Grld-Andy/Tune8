import React from 'react'
import './style.css'
import { alphabets } from '../../utilities'
import { SortedSongs } from '../../data'

interface Props{
    toggleShowNav: () => void,
    object: SortedSongs,
    closeAndScroll: (letter: string) => void,
    sortOrder?: string
}

const MusicNavigation: React.FC<Props> = ({toggleShowNav, object, closeAndScroll, sortOrder = ''}) => {
  return (
    <div className="songs-nav" onClick={toggleShowNav}>
        {
          sortOrder !== 'year' &&
            alphabets.map(letter => (
                object[letter] && object[letter].size > 0 ?
                <a key={`nav-${letter}`}
                className='open'
                onClick={(e) => {
                  e.preventDefault()
                  closeAndScroll(letter)
                }}>
                  {letter}
                </a> :
                <a key={`nav-${letter}`} className='closed'>{letter}</a> 
            ))
        }
        {
          sortOrder === 'year' &&
          Object.keys(object).map(year => (
            object[year] && object[year].size > 0 ?
            <a key={`nav-${year}`} className='open'
            onClick={(e) => {
              e.preventDefault()
              closeAndScroll(year)
            }}>{year}</a> :
            <a key={`nav-${year}`} className='closed'>{year}</a> 
          ))
        }
    </div>
  )
}

export default MusicNavigation
