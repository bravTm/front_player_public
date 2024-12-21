import { IPlaylist } from 'app/types/playlists.types';
import { ISong } from 'app/types/song.types';
import { createContext, FC, PropsWithChildren, useState } from 'react'
import { Text, View } from 'react-native'

interface IContext {
    songsToAdd: ISong[]
    playlists: IPlaylist[]
    activePlaylist: IPlaylist | null
    isShuffle: boolean
    orderToPlay: ISong[]

    setSongsToAdd: React.Dispatch<React.SetStateAction<ISong[]>>
    setPlaylists: React.Dispatch<React.SetStateAction<IPlaylist[]>>
    setActivePlstAndIsShuffle: (activePlaylist: IPlaylist, isShuffle: boolean, orderToPlay: ISong[]) => void
}

export const PlaylistsContext = createContext<IContext>({} as any);


const PlaylistsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [songsToAdd, setSongsToAdd] = useState([] as ISong[])
    const [playlists, setPlaylists] = useState([] as IPlaylist[])
    const [activePlaylist, setActivePlaylist] = useState({} as IPlaylist)
    const [isShuffle, setIsShuffle] = useState(false)
    const [orderToPlay, setOrderToPlay] = useState([] as ISong[])

    const setActivePlstAndIsShuffle = (activePlaylist: IPlaylist, isShuffle: boolean, orderToPlay: ISong[]) => {
        setActivePlaylist(activePlaylist)
        setIsShuffle(isShuffle)
        setOrderToPlay(orderToPlay)
    }
    
    return (
        <PlaylistsContext.Provider 
            value={{songsToAdd, setSongsToAdd, playlists, setPlaylists,
                activePlaylist, isShuffle, orderToPlay, setActivePlstAndIsShuffle
            }}>
            {children}
        </PlaylistsContext.Provider>
    )
}
export default PlaylistsProvider