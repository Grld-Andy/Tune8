import React from 'react'

interface Props{
    sortOrder: string
    setSortOrder: (val: string) => void
}
const SortButton: React.FC<Props> = ({sortOrder, setSortOrder}) => {
    const handleSort = (val: string) => {
        setSortOrder(val)
    }
    const sortTypes: Array<string> = ['Title', 'Album', 'Artist', 'Year']

    return (
        <button className='sort-button'>Sort by
            <div className="sort-options">
                {
                    sortTypes.map((sortType, index) => (
                        <li
                        key={`sortType-${index}`}
                        className={sortOrder === sortType.toLowerCase() ? 'active': ''}
                        onClick={() => {handleSort(sortType.toLowerCase())}}>
                            {sortType}
                        </li>
                    ))
                }
            </div>
        </button>
    )
}

export default SortButton
