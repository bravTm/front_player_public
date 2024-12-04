import { FC, memo, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useTypedNavigation } from 'app/hooks/useTypedNavigation'
import { useColorScheme } from 'nativewind'
import { useAudioPlay } from 'app/hooks/useAudioPlay'
import { useLang } from 'app/hooks/useLang'
import { useSongs } from 'app/hooks/useSongs'
import { usePlaybackInfo } from 'app/hooks/usePlaybackInfo'
import { useActions } from 'app/hooks/useActions'
import { usePlaylists } from 'app/hooks/usePlaylists'
import { usePlaySettings } from 'app/hooks/usePlaySettings'

import Layout from 'app/components/ui/Layout'
import Slider from '@react-native-community/slider'
import PlayerButton from './PlayerButton'
import { Marquee } from '@animatereactnative/marquee'
import { MaterialIcons } from '@expo/vector-icons'

import getArtistTitle from 'get-artist-title'
import formatDuration from 'format-duration'
import { width } from 'app/utils/constants'
import { removeSitesFromTitle } from 'app/utils/removeSitesFromTitle'
import { pause, playFromPosition, playNext, resume } from 'app/components/ui/AudioList/audio.methods'
import { setAsyncStorage } from 'app/utils/storage'
import { IPlaySettings } from 'app/types/play-settings.types'
import { showToast } from 'app/utils/toastShow'

const Player: FC = memo(() => {
    const [isBlur, setIsBlur] = useState(false)
    const { i18n } = useLang()
    const { colorScheme } = useColorScheme()
    const { goBack } = useTypedNavigation()

    const { currentAudio, isPlaying, playbackObj } = useAudioPlay()
    const { totalCount, songs } = useSongs()
    const { orderToPlay } = usePlaylists()
    const { isRepeatQueue, isRepeatSong } = usePlaySettings()
    const { changeState, changeSoundObj, changeIsPlaying, setPlayback, setIsRepeatQueue, setIsRepeatSong } = useActions()

    
    if(Object.values(currentAudio).length == 0) return null
    

    const { playbackDuration, playbackPosition } = usePlaybackInfo()

    const calculateSeekBar = () => {
        if(playbackDuration != 0 && playbackPosition != 0) {
            if(playbackDuration == undefined ||playbackPosition == undefined ) return 0
            return playbackPosition / playbackDuration
        }
        return 0
    }

    let currentIndex = songs.findIndex(el => el.id == (currentAudio as any).id)
    if(orderToPlay.length != [] as any) {
        currentIndex = orderToPlay.findIndex(el => el.id == (currentAudio as any).id)
    }

    // @ts-ignore
    const filename = currentAudio.filename.slice(0, currentAudio.filename.lastIndexOf("."))
    // @ts-ignore
    let [ artist, title ] = getArtistTitle(filename, {
        defaultArtist: i18n.t("music.unknownArtist")
    })

    title = removeSitesFromTitle(title)
    if(artist.length > 50) artist = artist.slice(0, 50) + "..."





    const playPrevNext = async (variant: "play" | "prev" | "next") => {
        if(variant == 'play') {   // it means we need to play or resume audio
            if(isPlaying) {
                // @ts-ignore
                await pause(playbackObj, changeSoundObj, changeIsPlaying)
            }else {
                // @ts-ignore
                await resume(playbackObj, changeSoundObj, changeIsPlaying)
            }
        }

        else if(variant == 'prev') {
            if(orderToPlay.length == 0) {
                let nextIndex = 0
                if(currentIndex - 1 < 0) nextIndex = totalCount - 1
                else nextIndex = currentIndex - 1

                await playNext(playbackObj, songs[nextIndex] as any, changeState, songs as any, setPlayback)
            }else {
                let nextIndex = 0
                if(currentIndex - 1 < 0) nextIndex = orderToPlay.length - 1
                else nextIndex = currentIndex - 1

                await playNext(playbackObj, orderToPlay[nextIndex] as any, changeState, orderToPlay as any, setPlayback)
            }
        }

        else if(variant == 'next') {
            if(orderToPlay.length == 0) {
                let nextIndex = 0
                if(currentIndex + 1 == totalCount) nextIndex = 0
                else nextIndex = currentIndex + 1
                
                await playNext(playbackObj, songs[nextIndex] as any, changeState, songs as any, setPlayback)
            } else {
                let nextIndex = 0
                if(currentIndex + 1 == orderToPlay.length) nextIndex = 0
                else nextIndex = currentIndex + 1

                await playNext(playbackObj, orderToPlay[nextIndex] as any, changeState, orderToPlay as any, setPlayback)
            }
        }

        setIsBlur(true)

        setTimeout(() => {
            setIsBlur(false)
        }, variant != 'play' ? 2000 : 600)
    }


    const seekBarChangePlayback = async (value: number) => {
        if(playbackDuration == undefined) return 0
        const newPlayback = Math.floor(value * playbackDuration) // in millis

        await playFromPosition(playbackObj, newPlayback)
        changeIsPlaying(true)
    }


    const onChangeIsRepeat = (type: "song" | "queue") => {
        let text = ""
        if(type == 'song') {
            if(!isRepeatSong) text = i18n.t("playSettings.popUpTrueRepeatSong")
            else text = i18n.t("playSettings.popUpFalseRepeatSong")
            setAsyncStorage("playSettings", JSON.stringify({ isRepeatQueue, isRepeatSong: !isRepeatSong } as IPlaySettings))
            setIsRepeatSong(!isRepeatSong)
        }
        else {
            if(!isRepeatQueue) text = i18n.t("playSettings.popUpTrueRepeatQueue")
            else text = i18n.t("playSettings.popUpFalseRepeatQueue")
            setAsyncStorage("playSettings", JSON.stringify({ isRepeatQueue: !isRepeatQueue, isRepeatSong } as IPlaySettings))
            setIsRepeatQueue(!isRepeatQueue)
        }

        showToast(text)
    }


    const timePosition = formatDuration(playbackPosition as any)
    const timeDuration = formatDuration(playbackDuration as any)

    return (
     <Layout>
        <View className='justify-between items-center flex-row mx-[3%]'>
            <TouchableOpacity 
                className='dark:bg-[#1465e3] bg-[#0b449e] rounded-full p-1 justify-center items-center'
                onPress={goBack}
            >
                <MaterialIcons 
                    name='arrow-back'
                    size={0.08 * width}
                    color={"#edebe6"}
                />
            </TouchableOpacity>

            <Text className='dark:text-light text-dark text-right mr-[5%]'>
                {`${currentIndex + 1} / ${orderToPlay?.length != 0 ? orderToPlay?.length : totalCount}`}
            </Text>
        </View>



        <View className='justify-center items-center mt-[20%]'>
            <View className='dark:bg-gray-400 bg-white rounded-2xl p-[4%] justify-center items-center mb-[10%]'>
                <MaterialIcons 
                    name={"music-note"}
                    size={0.7 * width}
                    color={colorScheme == 'dark' ? "#edebe6" : "#4287f5"}
                />
            </View>

            <View className='justify-start items-start w-[95%] mx-[2%]'>
                {title?.length >= 30 ? (
                    <Marquee spacing={20} speed={0.3}>
                        <Text 
                            className='dark:text-light text-dark overflow-hidden'
                            style={{fontSize: 0.055 * width}}
                        >
                            {title}
                        </Text>
                    </Marquee>
                ) : (
                    <Text 
                        className='dark:text-light text-dark'
                        style={{fontSize: 0.055 * width}}
                    >
                        {title}
                    </Text>

                )}
                <Text 
                    className='dark:text-light text-dark opacity-50 mt-[1%]'
                    style={{fontSize: 0.031 * width}}
                >
                    {artist}
                </Text>
            </View>
        </View>



        <View className='my-[5%]'>
            <Slider
                style={{width: width, height: 0.07 * width}}
                value={calculateSeekBar()}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor={colorScheme == 'dark' ? "#ffe600" : "#4287f5"}
                maximumTrackTintColor={colorScheme == 'dark' ?  "#FFFFFF" : "#000000"}
                thumbTintColor={colorScheme == 'dark' ? "#ffe600" : "#4287f5"}
                // onValueChange={seekBarChangePlayback}
                onSlidingComplete={seekBarChangePlayback} // когда перемотка закончилась
            />

            <View className='justify-between items-center flex-row mx-[2%] opacity-60'>
                <Text className='dark:text-light text-dark' 
                    style={{ fontSize: 0.03 * width }}    
                >
                    {timePosition}
                </Text>

                <Text className='dark:text-light text-dark' 
                    style={{ fontSize: 0.03 * width }}    
                >
                    {timeDuration}
                </Text>
            </View>
        </View>



        <View className='flex-row justify-between items-center '>
            <TouchableOpacity 
                className='justify-center items-center ml-[4%]'
                activeOpacity={0.6}
                onPress={() => onChangeIsRepeat("queue")}
            >
                <MaterialIcons 
                    name={isRepeatQueue ? "repeat-on" : "last-page"}
                    size={0.07 * width}
                    color={colorScheme == 'dark' ? "#edebe6" : "#4287f5"}
                />
            </TouchableOpacity>

            <View className='justify-center items-center flex-row'>
                <PlayerButton icon='skip-previous' onPress={() => playPrevNext('prev')} isBlur={isBlur} />
                <PlayerButton icon={isPlaying ? "pause" : 'play-arrow'} onPress={() => playPrevNext('play')} isBlur={isBlur} />
                <PlayerButton icon='skip-next' onPress={() => playPrevNext('next')} isBlur={isBlur} />
            </View>

            <TouchableOpacity 
                className='justify-center items-center mr-[4%]'
                activeOpacity={0.6}
                onPress={() => onChangeIsRepeat("song")}
            >
                <MaterialIcons 
                    name={isRepeatSong ? "repeat-one-on" : "keyboard-double-arrow-right"}
                    size={0.07 * width}
                    color={colorScheme == 'dark' ? "#edebe6" : "#4287f5"}
                />
            </TouchableOpacity>
        </View>
     </Layout>
    )
})

export default Player