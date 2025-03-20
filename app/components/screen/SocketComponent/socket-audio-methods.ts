import { IPlaylist } from "app/types/playlists.types";
import { ISong } from "app/types/song.types"
import { setAsyncStorage } from "app/utils/storage";
import { LangContext } from "app/provider/LangProvider";
import { Audio, AVPlaybackStatus } from "expo-av"



type TsetSoungObj = React.Dispatch<React.SetStateAction<any>>

type TsetIsPlaying = React.Dispatch<React.SetStateAction<boolean>>

export type TsetPlaybackPosition = React.Dispatch<React.SetStateAction<number>>
export type TsetPlaybackDuration = React.Dispatch<React.SetStateAction<number>>


export type TchangeState = (playbackObj: Audio.Sound, soundObj: AVPlaybackStatus, currentAudio: ISong, isPlaying: boolean, currentIndex: number) => void



export type TsetActivePlstAndIsShuffle =  (activePlaylist: IPlaylist, isShuffle: boolean, orderToPlay: ISong[]) => void


export const play = async (
    audioUrl: string, changeState: TchangeState, songs: ISong[], setPlaybackPosition: TsetPlaybackPosition,
    //@ts-ignore
    setPlaybackDuration: TsetPlaybackDuration
) => {
    try {
        // console.log(audioUrl)
        const playbackObject = new Audio.Sound();
        const status = await playbackObject.loadAsync({ uri: audioUrl }, { shouldPlay: true });


        setPlaybackPosition(0);
        setPlaybackDuration(1);

        changeState(
            playbackObject,
            status,
            {} as any,
            true,
            0
        );
        return;
    } catch (error) {
        console.log("ERROR PLAY", error);
    }
};




export const pause = async (
    playbackObj: Audio.Sound | null, setSoundObj: TsetSoungObj, setIsPlaying: TsetIsPlaying
) => {
    // pause audio
    try {
        const status = await playbackObj?.setStatusAsync({ shouldPlay: false })

        setSoundObj(status)
        setIsPlaying(false)
        return
    } catch(error) {
        console.log("ERROR PAUSE", error)
    }
}


export const resume = async (
    playbackObj: Audio.Sound | null, setSoungObj: TsetSoungObj, setIsPlaying: TsetIsPlaying
) => {
    try {
        const status = await playbackObj?.playAsync()

        setSoungObj(status as any)
        setIsPlaying(true)

        // return clearInterval(inter)
        return
    } catch(error) {
        console.log("ERROR RESUME", error)
    }
}



export const playNext = async (
    playbackObj: Audio.Sound, audioUrl: string, changeState: TchangeState, songs: ISong[], setPlaybackPosition: TsetPlaybackPosition, 
    //@ts-ignore
    setPlaybackDuration: TsetPlaybackDuration
) => {
    // playing audio for the first time
    try {
        await playbackObj?.stopAsync()
        await playbackObj?.unloadAsync()

        play(audioUrl, changeState, songs, setPlaybackPosition, setPlaybackDuration)
        return
    } catch(error) {
        console.log("ERROR PLAYNEXT", error)
    }
}


export const playFromPosition = async (
    audioUrl: string, playbackPosition: number, playbackDuration: number, changeState: TchangeState,
     setPlaybackPosition: TsetPlaybackPosition, setPlaybackDuration: TsetPlaybackDuration
) => {
    try {
        const playbackObject = new Audio.Sound();
        const status = await playbackObject.loadAsync({ uri: audioUrl }, { shouldPlay: true, positionMillis: playbackPosition });


        setPlaybackPosition(playbackPosition);
        setPlaybackDuration(playbackDuration);

        changeState(
            playbackObject,
            status,
            {} as any,
            true,
            0
        );

        // await playbackObject?.playFromPositionAsync(playbackPosition)
    } catch(error) {
        console.log("ERROR PLAYFROM", error)
    }
}


export const unloadMusic = async (playbackObj: Audio.Sound | null,changeState: TchangeState, setSoundObj: TsetSoungObj, setIsPlaying: TsetIsPlaying) => {
    try {
        const status = await playbackObj?.setStatusAsync({ shouldPlay: false })
        await playbackObj?.unloadAsync()

        changeState(
            null as any,
            null as any,
            {} as any,
            true,
            0
        );

        setSoundObj(status)
        setIsPlaying(false)
        return
    } catch(error) {
        console.log("ERROR UNLOAD JUST", error)
    }
} 