import { IPlaylist } from "app/types/playlists.types";
import { ISong } from "app/types/song.types"
import { setAsyncStorage } from "app/utils/storage";
import { Audio, AVPlaybackStatus } from "expo-av"



type TsetSoungObj = React.Dispatch<React.SetStateAction<any>>

type TsetIsPlaying = React.Dispatch<React.SetStateAction<boolean>>

type TsetPlaybackPosition = React.Dispatch<React.SetStateAction<number>>
type TsetPlaybackDuration = React.Dispatch<React.SetStateAction<number>>


type TchangeState = (playbackObj: Audio.Sound, soundObj: AVPlaybackStatus, currentAudio: ISong, isPlaying: boolean, currentIndex: number) => void



type TsetActivePlstAndIsShuffle =  (activePlaylist: IPlaylist, isShuffle: boolean, orderToPlay: ISong[]) => void



export const play = async (
    audio: ISong, changeState: TchangeState, songs: ISong[], setPlaybackPosition: TsetPlaybackPosition, 
    setPlaybackDuration: TsetPlaybackDuration,  setActivePlstAndIsShuffle?: TsetActivePlstAndIsShuffle, playlists?: IPlaylist[], playlistTitle?: string
) => {
    try {
        let initialVolume = 0.1, step = 0.1

        const playbackObject = new Audio.Sound()
        const status = await playbackObject.loadAsync({ uri: audio.uri }, { shouldPlay: true, volume: initialVolume })

        const inter = setInterval(() => {
            playbackObject?.setVolumeAsync(initialVolume + step, 0)
            initialVolume += step
        }, 300)

        
        setPlaybackPosition(0)
        setPlaybackDuration(1)

        const currentIndex = songs.findIndex(el => el.id == (audio as any).id)
        
        changeState(
            playbackObject,
            status,
            audio,
            true,
            currentIndex 
        )
        
        setAsyncStorage("previousAudio", JSON.stringify({ audio, index: currentIndex }))
        
        if(playlistTitle == undefined && !!setActivePlstAndIsShuffle) {
            setActivePlstAndIsShuffle(null as any, false, [])
        }
        else if(playlistTitle != undefined && !!setActivePlstAndIsShuffle && !!playlists) {
            let plst = playlists.map((item) => {
                if(item.title == item.title) return item
            })
            
            if(plst.length == 0) return

            setActivePlstAndIsShuffle(plst[0] as any, false, plst[0]?.songs as any)
        }

        // return clearInterval(inter)
        return
    } catch(error) {
        console.log("ERROR PLAY", error)
    }
}


export const pause = async (
    playbackObj: Audio.Sound | null, setSoungObj: TsetSoungObj, setIsPlaying: TsetIsPlaying
) => {
    // pause audio
    try {
        const status = await playbackObj?.setStatusAsync({ shouldPlay: false })

        setSoungObj(status)
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
        let initialVolume = 0.1, step = 0.1

        playbackObj?.setVolumeAsync(initialVolume) // изначально volume = 0
        const status = await playbackObj?.playAsync()

        setInterval(() => {
            playbackObj?.setVolumeAsync(initialVolume + step, 0)
            initialVolume += step
        }, 300)
        
        setSoungObj(status as any)
        setIsPlaying(true)

        // return clearInterval(inter)
        return
    } catch(error) {
        console.log("ERROR RESUME", error)
    }
}



export const playNext = async (
    playbackObj: Audio.Sound | null, audio: ISong, changeState: TchangeState, songs: ISong[], setPlaybackPosition: TsetPlaybackPosition, 
    setPlaybackDuration: TsetPlaybackDuration, setActivePlstAndIsShuffle?: TsetActivePlstAndIsShuffle, playlists?: IPlaylist[], playlistTitle?: string
) => {
    // playing audio for the first time
    try {
        await playbackObj?.stopAsync()
        await playbackObj?.unloadAsync()

        play(audio, changeState, songs, setPlaybackPosition, setPlaybackDuration, setActivePlstAndIsShuffle, playlists, playlistTitle)
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