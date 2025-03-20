import { IPlaySettings } from "app/types/play-settings.types"
import { IPlaylist } from "app/types/playlists.types"
import { ISong } from "app/types/song.types"
import { getAsyncStorage } from "app/utils/storage"
import { Audio, AVPlaybackStatus } from "expo-av"


type typeChangeState = (playbackObj: Audio.Sound, soundObj: AVPlaybackStatus, currentAudio: ISong, isPlaying: boolean, currentIndex: number) => void
type typeSetPlaylists = React.Dispatch<React.SetStateAction<IPlaylist[]>>


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

    changeState(playbackObject, status, currentAudio, false, currentIndex)
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


export const loadPlaySettings = async (
    setIsRepeatQueue: React.Dispatch<React.SetStateAction<boolean>>, setIsRepeatSong: React.Dispatch<React.SetStateAction<boolean>>
) => {
    // setAsyncStorage("playSettings", {})
    let settings = await getAsyncStorage('playSettings')

    if(!settings) {
        settings = { isRepeatQueue: true, isRepeatSong: false } as IPlaySettings | any
    }
    else {
        settings = JSON.parse(settings)
    }

    // @ts-ignore
    setIsRepeatQueue(settings?.isRepeatQueue as any)
    // @ts-ignore
    setIsRepeatSong(settings?.isRepeatSong as any)
}





export const getTopSongs = async (setTopSongs: React.Dispatch<React.SetStateAction<never[]>>) => {
    let topSongs = await getAsyncStorage('topSongs')

    
    if(!topSongs) {
        topSongs = [] as any
    }
    else {
        topSongs = JSON.parse(topSongs)
    }

    setTopSongs(topSongs as any)
}