import { ActionCreatorWithPayload } from "@reduxjs/toolkit"
import { IAudioPlay } from "app/store/audioPlay/audioPlay.slice"
import { IPlaySettings } from "app/types/play-settings.types"
import { IPlaylist } from "app/types/playlists.types"
import { ISong } from "app/types/song.types"
import { getAsyncStorage } from "app/utils/storage"
import { Audio } from "expo-av"


type typeChangeState = ActionCreatorWithPayload<IAudioPlay, "audioPlay/changeState">
type typeSetPlaylists = ActionCreatorWithPayload<IPlaylist[], "playlists/setPlaylists">
type typeSetPlaySettings = ActionCreatorWithPayload<IPlaySettings, "playSettings/setPlaySettings">


// ----------------------------------------------------------------
export const loadPreviousSong = async (songs: ISong[], changeState: typeChangeState) => {
    let prevAudio = await getAsyncStorage("previousAudio")
    let currentAudio = null, currentIndex = null

    if(prevAudio == null || prevAudio == undefined) {
    currentAudio = songs[0]
    currentIndex = 0
    }
    else {
    prevAudio = JSON.parse(prevAudio)
    // @ts-ignore
    currentAudio = prevAudio.audio
    // @ts-ignore
    currentIndex = prevAudio.index
    }

    const playbackObject = new Audio.Sound()
    const status = await playbackObject.loadAsync({ uri: currentAudio.uri }, { shouldPlay: false })

    return changeState({
        currentAudio,
        currentIndex,
        isPlaying: false,
        playbackObj: playbackObject,
        soundObj: status
    })
}


export const loadPlaylists = async (setPlaylists: typeSetPlaylists) => {
    // setAsyncStorage("playlists", [])
    let storage_playlists = await getAsyncStorage("playlists")

    if(!storage_playlists) {
        storage_playlists = [] as any
    }
    else {
        storage_playlists = JSON.parse(storage_playlists)
    }

    setPlaylists(storage_playlists as any)
}


export const loadPlaySettings = async (setPlaySettings: typeSetPlaySettings) => {
    // setAsyncStorage("playSettings", {})
    let settings = await getAsyncStorage('playSettings')

    if(!settings) {
        settings = { isRepeatQueue: true, isRepeatSong: false } as IPlaySettings | any
    }
    else {
        settings = JSON.parse(settings)
    }

    setPlaySettings(settings as any)
}