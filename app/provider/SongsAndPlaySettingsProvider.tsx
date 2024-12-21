import { ISong } from 'app/types/song.types';
import { createContext, FC, PropsWithChildren, useState } from 'react'
import { Text, View } from 'react-native'


interface IContext {
    songs: ISong[]
    totalCount: number
    isRepeatSong: boolean
    isRepeatQueue: boolean

    setSongs: React.Dispatch<React.SetStateAction<ISong[]>>
    setTotalCount: React.Dispatch<React.SetStateAction<number>>
    setIsRepeatSong: React.Dispatch<React.SetStateAction<boolean>>
    setIsRepeatQueue: React.Dispatch<React.SetStateAction<boolean>>
}

export const SongsAndPlaySettingsContext = createContext<IContext>({} as any);



const SongsAndPlaySettingsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [songs, setSongs] = useState([] as ISong[])
    const [totalCount, setTotalCount] = useState(0)
    const [isRepeatSong, setIsRepeatSong] = useState(false)
    const [isRepeatQueue, setIsRepeatQueue] = useState(true)


    return (
        <SongsAndPlaySettingsContext.Provider 
            value={{songs, setSongs, totalCount, setTotalCount, isRepeatSong, setIsRepeatSong, isRepeatQueue, setIsRepeatQueue }}>
        {children}
        </SongsAndPlaySettingsContext.Provider>
    )
}
export default SongsAndPlaySettingsProvider