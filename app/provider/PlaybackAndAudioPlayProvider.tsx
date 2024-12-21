import { ISong } from 'app/types/song.types';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { createContext, FC, PropsWithChildren, useState } from 'react'
import { Text, View } from 'react-native'

interface IContext {
    playbackPosition: number | undefined
    playbackDuration: number | undefined

    playbackObj: Audio.Sound | null
    soundObj: AVPlaybackStatus | null
    currentAudio: ISong | {},
    currentIndex: number
    isPlaying: boolean

    setPlaybackPosition: React.Dispatch<React.SetStateAction<number>>
    setPlaybackDuration: React.Dispatch<React.SetStateAction<number>>
    setPlaybackObj: React.Dispatch<React.SetStateAction<null>>
    setSoundObj: React.Dispatch<React.SetStateAction<null>>
    setCurrentAudio: React.Dispatch<React.SetStateAction<{}>>
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
    changeState: (playbackObj: Audio.Sound, soundObj: AVPlaybackStatus, currentAudio: ISong, isPlaying: boolean, currentIndex: number) => void
}

export const PlaybackAndAudioPlayContext = createContext<IContext>({} as any);


const PlaybackAndAudioPlayProvider: FC<PropsWithChildren> = ({ children }) => {
    const [playbackPosition, setPlaybackPosition] = useState(0)
    const [playbackDuration, setPlaybackDuration] = useState(0)

    const [playbackObj, setPlaybackObj] = useState(null)
    const [soundObj, setSoundObj] = useState(null)
    const [currentAudio, setCurrentAudio] = useState({})
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    const changeState = (playbackObj: Audio.Sound, 
        soundObj: AVPlaybackStatus, 
        currentAudio: ISong,
        isPlaying: boolean,
        currentIndex: number
    ) => {

        setPlaybackObj(playbackObj as any)
        setSoundObj(soundObj as any)
        setCurrentAudio(currentAudio)
        setIsPlaying(isPlaying)
        setCurrentIndex(currentIndex)
    }


    return (
        <PlaybackAndAudioPlayContext.Provider 
        value={{playbackPosition, setPlaybackPosition, playbackDuration, setPlaybackDuration,
            playbackObj, setPlaybackObj, soundObj, setSoundObj, currentAudio, setCurrentAudio,
            currentIndex, setCurrentIndex, isPlaying, setIsPlaying, changeState
         }}>
            {children}
        </PlaybackAndAudioPlayContext.Provider>
    )
}

export default PlaybackAndAudioPlayProvider