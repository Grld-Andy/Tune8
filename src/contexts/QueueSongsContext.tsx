import { createContext, ReactNode, useEffect, useReducer } from "react";
import { Song } from "../data";
import { QueueSongsReducer } from "../reducers/QueueSongsReducer";

interface Props{
    children: ReactNode
}
interface QueueSongsType{
    queue: Array<Song> | [],
    dispatch: React.Dispatch<{type: string, payload: Array<Song>|[]}>
}

export const QueueSongsContext = createContext<QueueSongsType>({
    queue: [],
    dispatch: () => null
})

const QueueSongsContextProvider: React.FC<Props> = (props) => {
    const [queue, dispatch] = useReducer(QueueSongsReducer, [], () => {
        const localQueue = localStorage.getItem('queue')
        try { return localQueue ? JSON.parse(localQueue) : [] }
        catch { return [] }
    })

    useEffect(() => {
        localStorage.setItem('queue', JSON.stringify(queue))
    }, [queue])

    return (
        <QueueSongsContext.Provider value={{queue, dispatch}}>
            {props.children}
        </QueueSongsContext.Provider>
    )
}

export default QueueSongsContextProvider