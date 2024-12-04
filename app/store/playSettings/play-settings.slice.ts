import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPlaySettings } from "app/types/play-settings.types";

export const playSettingsSlice = createSlice({
    name: "playSettings",
    initialState: {isRepeatSong: false, isRepeatQueue: false},
    reducers: {
        setPlaySettings(state: IPlaySettings, action: PayloadAction<IPlaySettings>) {
            state = action.payload
            return state
        },

        setIsRepeatSong(state: IPlaySettings, action: PayloadAction<boolean>) {
            state.isRepeatSong = action.payload
            return state
        },

        setIsRepeatQueue(state: IPlaySettings, action: PayloadAction<boolean>) {
            state.isRepeatQueue = action.payload
            return state
        },
    }
})


export const playSettingsReducer = playSettingsSlice.reducer