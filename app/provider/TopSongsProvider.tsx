import { createContext, FC, PropsWithChildren, useState } from 'react'

interface IContext {
    topSongs: {id: string, listenCount: number}[]
    setTopSongs: React.Dispatch<React.SetStateAction<never[]>>
}


export const TopSongsContext = createContext<IContext>({} as any);


const TopSongsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [topSongs, setTopSongs] = useState([])

    return (
        <TopSongsContext.Provider value={{topSongs, setTopSongs }}>
            {children}
        </TopSongsContext.Provider>
    )
}

export default TopSongsProvider