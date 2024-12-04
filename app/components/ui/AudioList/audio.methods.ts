import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { IAudioPlay } from "app/store/audioPlay/audioPlay.slice";
import { IReduxPlayback } from "app/store/playback/playback.slice";
import { IPlaylist } from "app/types/playlists.types";
import { ISong } from "app/types/song.types"
import { setAsyncStorage, setStorage } from "app/utils/storage";
import { Audio, AVPlaybackStatus, InterruptionModeAndroid } from "expo-av"


type TchangePlaybackObj = ActionCreatorWithPayload<
    (payload: Audio.Sound) => {
        payload: Audio.Sound;
        type: "audioPlay/changePlaybackObj";
    }>

type TchangeSoundObj = ActionCreatorWithPayload<
    (payload: AVPlaybackStatus) => {
        payload: AVPlaybackStatus;
        type: "audioPlay/changeSoundObj";
    }>


type TchangeCurrentAudio = ActionCreatorWithPayload<
    (payload: ISong) => {
        payload: ISong;
        type: "audioPlay/changeCurrentAudio";
    }>


type TchangeState = ActionCreatorWithPayload<IAudioPlay, "audioPlay/changeState">

type TchangeIsPlaying = ActionCreatorWithPayload<boolean, "audioPlay/changeIsPlaying">

type TsetPlayback = ActionCreatorWithPayload<IReduxPlayback, "playback/setPlayback">

type TsetActivePlstAndIsShuffle = ActionCreatorWithPayload<{
    activePlaylist: IPlaylist | null;
    isShuffle: boolean;
    orderToPlay: ISong[];
}, "playlists/setActivePlstAndIsShuffle">


export const play = async (
    audio: ISong, changeState: TchangeState, songs: ISong[], setPlayback: TsetPlayback, setActivePlstAndIsShuffle?: TsetActivePlstAndIsShuffle, playlists?: IPlaylist[], playlistTitle?: string
) => {
    try {
        const playbackObject = new Audio.Sound()
        const status = await playbackObject.loadAsync({ uri: audio.uri }, { shouldPlay: true })
        
        setPlayback({ playbackDuration: 1, playbackPosition: 0 })

        const currentIndex = songs.findIndex(el => el.id == (audio as any).id)
        
        changeState({
            playbackObj: playbackObject,
            soundObj: status,
            currentAudio: audio,
            isPlaying: true,
            currentIndex: currentIndex 
        })
        
        setAsyncStorage("previousAudio", JSON.stringify({ audio, index: currentIndex }))
        
        if(playlistTitle == undefined && !!setActivePlstAndIsShuffle) {
            setActivePlstAndIsShuffle({
                activePlaylist: null,
                isShuffle: false,
                orderToPlay: []
            })
        }
        else if(playlistTitle != undefined && !!setActivePlstAndIsShuffle && !!playlists) {
            let plst = playlists.map((item) => {
                if(item.title == item.title) return item
            })
            if(plst.length == 0) return
            setActivePlstAndIsShuffle({
                activePlaylist: plst[0] as any,
                isShuffle: false,
                orderToPlay: plst[0]?.songs as any
            })
        }
        return
    } catch(error) {
        console.log("ERROR PLAY", error)
    }
}


export const pause = async (
    playbackObj: Audio.Sound | null, changeSoundObj: TchangeSoundObj, changeIsPlaying: TchangeIsPlaying
) => {
    // pause audio
    try {
        const status = await playbackObj?.setStatusAsync({ shouldPlay: false })
        changeSoundObj(status as any)
        changeIsPlaying(false)
        return
    } catch(error) {
        console.log("ERROR PAUSE", error)
    }
}


export const resume = async (
    playbackObj: Audio.Sound | null, changeSoundObj: TchangeSoundObj, changeIsPlaying: TchangeIsPlaying
) => {
    //resume audio
    try {
        const status = await playbackObj?.playAsync()
        changeSoundObj(status as any)
        changeIsPlaying(true)
        return
    } catch(error) {
        console.log("ERROR RESUME", error)
    }
}



export const playNext = async (
    playbackObj: Audio.Sound | null, audio: ISong, changeState: TchangeState, songs: ISong[], setPlayback: TsetPlayback, setActivePlstAndIsShuffle?: TsetActivePlstAndIsShuffle, playlists?: IPlaylist[], playlistTitle?: string
) => {
    // playing audio for the first time
    try {
        await playbackObj?.stopAsync()
        await playbackObj?.unloadAsync()

        play(audio, changeState, songs, setPlayback, setActivePlstAndIsShuffle, playlists, playlistTitle)
        return
    } catch(error) {
        console.log("ERROR PLAYNEXT", error)
    }
}


export const playFromPosition = async (
    playbackObj: Audio.Sound | null, playbackPosition: number // in millis
) => {
    try {
        await playbackObj?.playFromPositionAsync(playbackPosition)
    } catch(error) {
        console.log("ERROR PLAYFROM", error)
    }
}