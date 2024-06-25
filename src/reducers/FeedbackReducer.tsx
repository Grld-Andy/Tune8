import { FeedbackContextState } from "../contexts/FeedbackContext"

export const FeedbackReducer = (state: FeedbackContextState, action:{type: string, payload: {text: string, view: string}}) => {
    switch(action.type){
        case 'LOADER':
            return {...action.payload, view: 'loader'}
        case 'COMPLETED':
            return {...action.payload, view: 'completed'}
        case 'CLOSE_LOADER':
            return action.payload
        default:
            return state
    }
}
