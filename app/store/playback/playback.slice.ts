import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IReduxPlayback {
    playbackPosition: number | undefined,
    playbackDuration: number | undefined
}

export const playbackSlice = createSlice({
    name: 'playback',
    initialState: { playbackPosition: 0, playbackDuration: 0 } as IReduxPlayback,
    reducers: {
        setPlayback(state: IReduxPlayback, action: PayloadAction<IReduxPlayback>) {
            state = action.payload
            return state
        }
    }
})


export const playbackReducer = playbackSlice.reducer