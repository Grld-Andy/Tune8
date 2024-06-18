import { createContext, Dispatch, ReactNode, useEffect, useReducer } from "react"
import { AllSongsReducer } from "../reducers/AllSongsReducer"
import { Song } from "../data"
import {parseFile} from 'music-metadata'
import { placeholderSongImages, songPaths } from "../assets"
import { DurationToString } from "../utilities"
import { v1 as uuidv1 } from "uuid"

interface Props {
    children: ReactNode
}

interface AllSongsContextType {
    songs: Array<Song> | []
    songsDispatch: Dispatch<{ type: string; payload: Array<Song> | [] }>
}

export const AllSongsContext = createContext<AllSongsContextType>({
    songs: [],
    songsDispatch: () => null
})

const AllSongsContextProvider: React.FC<Props> = ({ children }) => {
    const [songs, songsDispatch] = useReducer(AllSongsReducer, [])

    useEffect(() => {
        const fetchMusicData = async () => {
            const musicData: Array<Song> = []
            for (const filePath of songPaths) {
                try {
                    const metadata = await parseFile(filePath)
                    const duration = metadata.format.duration
                    const imageSrc = metadata.common.picture && metadata.common.picture.length > 0
                        ? `data:${metadata.common.picture[0].format};base64,${metadata.common.picture[0].data.toString('base64')}`
                        : placeholderSongImages[Math.floor(Math.random() * placeholderSongImages.length)]
                    const songTitle = metadata.common.title ? metadata.common.title : filePath.split('.mp3')[0]
                    const songAlbum = metadata.common.album ? metadata.common.album : `Unknown Album`
                    const songYear = metadata.common.year ? metadata.common.year : 0
                    const musicDataObject: Song = {
                        id: uuidv1(),
                        isFavorite: false,
                        src: filePath,
                        tag: {
                            tags: {
                                title: songTitle,
                                artist: metadata.common.artist ? metadata.common.artist : `Unknown Artist`,
                                album: songAlbum,
                                year: songYear,
                                genre: metadata.common.genre ? metadata.common.genre[0] : `#`,
                            }
                        },
                        imageSrc,
                        duration: duration ? DurationToString(duration) : "1:00"
                    }
                    musicData.push(musicDataObject)
                } catch (error) {
                    console.error(`Error parsing file ${filePath}:`, error)
                }
            }
            songsDispatch({ type: 'SET_SONGS', payload: musicData })
        }

        fetchMusicData()
    }, [])

    return (
        <AllSongsContext.Provider value={{ songs, songsDispatch }}>
            {children}
        </AllSongsContext.Provider>
    )
}

export default AllSongsContextProvider
