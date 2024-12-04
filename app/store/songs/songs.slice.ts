import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import * as MediaLibrary from "expo-media-library"

export interface IReduxSongs {
    songs: MediaLibrary.Asset[],
    totalCount: number
}

export const songsSlice = createSlice({
    name: "songs",
    // @ts-ignore
    initialState: { songs: [], totalCount: 0 } as IReduxSongs,
    reducers: {
        initialize: (state: IReduxSongs, action: PayloadAction<IReduxSongs>) => {
            state = action.payload
            return action.payload
        },
    }
})


export const songsReducer = songsSlice.reducer