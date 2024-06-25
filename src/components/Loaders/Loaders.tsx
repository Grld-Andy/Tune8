import React, { useContext } from 'react'
import './style.css'
import { FeedbackContext } from '../../contexts/FeedbackContext'
import { SiTicktick } from 'react-icons/si'

const Loaders: React.FC = () => {
    const {feedback} = useContext(FeedbackContext)

    return (
        <>
            {
                feedback.view === 'loader' &&
                <div className='loader'>
                    <div className="spinner"></div>
                    {feedback.text}
                </div>
            }
            {
                feedback.view === 'completed' &&
                <div className="notification">
                    <SiTicktick size={15}/>
                    Done
                </div>
            }
        </>
  )
}

export default Loaders
