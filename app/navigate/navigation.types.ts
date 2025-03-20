import { ComponentType } from 'react'

export type TypeRootStackParamList = {
    Main: undefined
    Playlists: undefined
    Settings: undefined
    Player: undefined
    SinglePlaylist: {
        title: string
    }
    AddSongsToPlaylist: {
        title: string
    },
    KaraokeLyrics: undefined,
    SocketComponent: undefined
}


export interface IRoute {
    name: keyof TypeRootStackParamList
    component: ComponentType
}