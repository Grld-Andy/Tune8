import React, { useState } from 'react'
import './style.css'

interface Props{
    sortOrder: string
    showNav: boolean
    setSortOrder: (val: string) => void
    page?: string
}
const SortButton: React.FC<Props> = ({sortOrder, setSortOrder, showNav, page}) => {
    const handleSort = (val: string) => {
        setSortOrder(val)
    }
    // const sortTypes: Array<string> = ['Title', 'Album', 'Artist', 'Year']

    const [showSortOptions, setShowSortOptions] = useState<boolean>(false)
    const handleSortOptions = () => {
        setShowSortOptions(!showSortOptions)
    }

    return (
        <>
            <button className='sort-button' onClick={handleSortOptions}>Sort by</button>
            {
                showSortOptions && !showNav &&
                <div className="sort-options" onMouseLeave={handleSortOptions}>
                    {
                        page === 'albums' ||
                        <li className={sortOrder === 'title' ? 'active': ''}
                        onClick={() => {handleSort('title')}}>
                            Title
                        </li>
                    }
                    <li className={sortOrder === 'album' ? 'active': ''}
                    onClick={() => {handleSort('album')}}>
                        Album
                    </li>
                    <li className={sortOrder === 'artist' ? 'active': ''}
                    onClick={() => {handleSort('artist')}}>
                        Artist
                    </li>
                    <li className={sortOrder === 'year' ? 'active': ''}
                    onClick={() => {handleSort('year')}}>
                        Year
                    </li>
                </div>
            }
        </>
        
    )
}

export default SortButton
