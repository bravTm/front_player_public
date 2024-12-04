import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISong } from "app/types/song.types";
import { Audio, AVPlaybackStatus } from "expo-av";

export interface IAudioPlay {
  playbackObj: Audio.Sound | null, 
  soundObj: AVPlaybackStatus | null, 
  currentAudio: ISong | {},
  isPlaying: boolean,
  currentIndex: number
}

export const audioPlay = createSlice({
  name: "audioPlay",
  initialState: { playbackObj: null, soundObj: null, currentAudio: {}, isPlaying: false, currentIndex: 0 } as IAudioPlay,
  reducers: {
    changeState(state: any, action: PayloadAction<IAudioPlay>) {
      state = {
        playbackObj: action.payload.playbackObj,
        soundObj: action.payload.soundObj,
        currentAudio: action.payload.currentAudio,
        isPlaying: action.payload.isPlaying,
        currentIndex: action.payload.currentIndex
      }
      return state
    },

    changePlaybackObj(state: any, action:  PayloadAction<Audio.Sound>) {
        state.playbackObj = action.payload
        return state
    },

    changeSoundObj(state: any, action:  PayloadAction<AVPlaybackStatus>) {
        state.soundObj = action.payload
        return state
    },

    changeCurrentAudio(state: any, action:  PayloadAction<ISong>) {
        state.currentAudio = action.payload
        return state
    },

    changeIsPlaying(state: any, action:  PayloadAction<boolean>) {
      state.isPlaying = action.payload
      return state
    },
  }  
})

export const audioPlayReducer = audioPlay.reducer