import React, { createContext, Dispatch, useReducer } from 'react'
import { FeedbackReducer } from '../reducers/FeedbackReducer';

interface Props{
    children: React.ReactNode
}

export interface FeedbackContextState{
    text: string,
    view: string
}
interface FeedbackContextType{
    feedback: FeedbackContextState,
    feedbackDispatch: Dispatch<{ type: string; payload: { text: string; view: string; }; }>
}
export const FeedbackContext = createContext<FeedbackContextType>({
    feedback: {text: '', view: ''},
    feedbackDispatch: () => null
})

const FeedbackContextProvider: React.FC<Props> = (props) => {
    const [feedback, feedbackDispatch] = useReducer(FeedbackReducer, {text: '', view: ''})
  return (
    <FeedbackContext.Provider value={{feedback, feedbackDispatch}}>
      {props.children}
    </FeedbackContext.Provider>
  )
}

export default FeedbackContextProvider
