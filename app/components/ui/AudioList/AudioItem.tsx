import { FC, memo } from 'react'
import { Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { useColorScheme } from 'nativewind'
import { useLang } from 'app/hooks/useLang'
import formatDuration from 'format-duration'
// import getArtistTitle from 'get-artist-title'
import { ISong } from 'app/types/song.types'
import { MaterialIcons } from '@expo/vector-icons'
import { width } from 'app/utils/constants'
import { removeSitesFromTitle } from 'app/utils/removeSitesFromTitle'
import { getArtistAndTitle } from 'app/utils/getArtistAndTitle'


interface IAudioItem {
    item: ISong
    setIsShow: React.Dispatch<React.SetStateAction<{
        state: boolean;
        songItem: ISong;
    }>>
    onAudioPress: () => void
    isPlaying: boolean
    activeId: string
}

const AudioItem: FC<IAudioItem> = memo(({ item, setIsShow, onAudioPress, activeId, isPlaying }) => {
    const { colorScheme } = useColorScheme()
    const { i18n } = useLang()

    const duration = formatDuration(item.duration * 1000)
    const filename = item.filename.slice(0, item.filename.lastIndexOf("."))
    // @ts-ignore
    // let [ artist, title ] = getArtistTitle(filename, {
    //     defaultArtist: i18n.t("music.unknownArtist")
    // })

    let { artist, title } = getArtistAndTitle(filename, i18n.t("music.unknownArtist"))

    // title = removeSitesFromTitle(title)
    if(title.length >= 26) title = title.slice(0, 26) + "..." 
    if(artist.length > 26) artist = artist.slice(0, 26) + "..."

    const onOpenOrCloseMenuMore = () => {
        setIsShow({
            state: true,
            songItem: item
        })
    }


    return (
    <View className='w-[100wh] px-[2.5%] mb-[5%]' style={{ height: 0.11 * width }}>
        <View className='items-top flex-row'>

            <TouchableWithoutFeedback onPress={onAudioPress}>
                <View className='flex-row items-top w-[93%]'>

                    <View className='w-[15%]'>
                        {/* Image */}
                        <View 
                            className='p-[5%] dark:bg-dark-gray-light bg-light-gray-light rounded-lg justify-center
                            items-center'
                            style={{
                                width: 0.12 * width,
                                height: 0.12* width
                            }}
                        >
                            {activeId != item?.id ? (
                                <MaterialIcons 
                                    name='music-note'
                                    size={0.07 * width}
                                    color={colorScheme == 'dark' ? "#edebe6" : "#575653"}
                                    className='ml-[1%]'
                                />
                            ) : (
                                <MaterialIcons 
                                    name={isPlaying ? "pause" : "play-arrow"}
                                    size={0.07 * width}
                                    color={colorScheme == 'dark' ? "#ff1944" : "#ffffff"}
                                    className='ml-[1%]'
                                />
                            )}
                        </View>
                    </View>

                    <View className='justify-between w-[78%] -z-50'>
                        {/* Title */}
                        <Text 
                            className='dark:text-white text-[#2b2b29] ml-[2.5%] font-semibold'
                            style={{fontSize: 0.04 * width}}
                        >
                            {title}
                        </Text>

                        <View className='justify-between items-start ml-[2.5%] flex-row'>

                            <View className='flex-row justify-center items-center'>
                                <MaterialIcons 
                                    name='person'
                                    size={0.035 * width}
                                    color={colorScheme == 'dark' ? "#807b7a" : "#6e6c67"}
                                    className='ml-[1%] mr-[2%]'
                                />
                                <Text 
                                    className='dark:text-[#8f8989] text-[#6e6c67] text-right'
                                    style={{fontSize: 0.03 * width}}
                                >
                                    {artist}
                                </Text>
                            </View>

                            <View className='flex-row justify-center items-center'>
                                <MaterialIcons 
                                    name='timer'
                                    size={0.035 * width}
                                    color={colorScheme == 'dark' ? "#807b7a" : "#6e6c67"}
                                    className='ml-[1%] mr-[2%]'
                                />
                                <Text 
                                    className='dark:text-[#8f8989] text-[#6e6c67] text-right mr-[3%]'
                                    style={{fontSize: 0.03 * width}}
                                >
                                    {duration}
                                </Text>
                            </View>

                        </View>
                    </View>
                    
                
                </View>
            </TouchableWithoutFeedback>

            <TouchableOpacity 
                className='justify-end items-center w-[7%]'
                onPress={onOpenOrCloseMenuMore}
            >
                <MaterialIcons 
                    name='more-vert'
                    size={0.07 * width}
                    color={colorScheme == 'dark' ? "white" : "#121211"}
                    className='font-bold'
                />
            </TouchableOpacity>

        </View>
    
    </View>
    )
})

export default AudioItem