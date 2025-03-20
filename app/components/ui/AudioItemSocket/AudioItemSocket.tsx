import { FC, memo } from 'react'
import { Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { useColorScheme } from 'nativewind'
import { useLang } from 'app/hooks/useLang'
import { ISong } from 'app/types/song.types'
import { MaterialIcons } from '@expo/vector-icons'
import { width } from 'app/utils/constants'
import { getArtistAndTitle } from 'app/utils/getArtistAndTitle'
import { formatDuration } from 'app/utils/formatDuration'


interface IAudioItemSocket {
    url: string
    isPlaying: boolean
    plPos: number
    plDur: number
    onAudioPress: (type: "PLAY" | "PAUSE") => Promise<void>
}

const AudioItemSocket: FC<IAudioItemSocket> = memo(({ url, isPlaying, plDur, plPos, onAudioPress }) => {
    const { colorScheme } = useColorScheme()
    const { i18n } = useLang()

    const file = url.slice(url.lastIndexOf("/") + 1, url.length)

    const position = formatDuration(plPos)
    const duration = formatDuration(plDur)
    const filename = file.slice(0, file.lastIndexOf("."))

    let { artist, title } = getArtistAndTitle(filename, i18n.t("music.unknownArtist"))

    if(title.length >= 20) title = title.slice(0, 20) + "..." 
    if(artist.length > 20) artist = artist.slice(0, 20) + "..."



    return (
    <View className='px-[2.5%] mb-[20%] mt-[10%]' style={{ height: 0.2 * width, width: width }}>
        <View className='justify-center items-top flex-row'>

            <View className='justify-center items-center w-[85%]'>
                <Text className="dark:text-light text-dark font-semibold" style={{ fontSize: 0.03 * width }}>
                    {artist}
                </Text>

                <Text className="dark:text-light text-dark mb-[2%]" style={{ fontSize: 0.065 * width, textAlign: 'center' }}>
                    {title}
                </Text>

                <TouchableOpacity onPress={() => onAudioPress(isPlaying ? "PAUSE" : "PLAY")} activeOpacity={0.9}>
                    <View className='w-full h-[70%] bg-gray-400 rounded-lg justify-center' 
                        style={{ width: width * 0.85 }}
                    >
                        <View 
                            className='bg-[#c94483] h-full rounded-md w-full'
                            style={{ width: width * 0.85 * (plPos / plDur || 0) }}
                        >
                        </View>
                    </View>

                    <View 
                        className='absolute bg-[#615958] rounded-lg ' 
                        style={{ marginLeft: width * 0.85 * 0.45, marginTop: 8 }}
                    >
                        {!isPlaying ? (
                            <MaterialIcons 
                                name='play-arrow'
                                size={0.12 * width}
                                color={colorScheme == 'dark' ? "#edebe6" : "#575653"}
                                className='ml-[1%]'
                            />
                        ) : (
                            <MaterialIcons 
                                name={isPlaying ? "pause" : "play-arrow"}
                                size={0.12 * width}
                                // color={colorScheme == 'dark' ? "#ff1944" : "#ffffff"}
                                color={"#e6dadf"}
                                className='ml-[1%]'
                            />
                        )}
                    </View>

                    <View className='flex-row justify-between items-center opacity-45'>
                        <Text className='dark:text-light text-dark' style={{ fontSize: 0.03 * width }}>
                            {position}
                        </Text>

                        <Text className='dark:text-light text-dark' style={{ fontSize: 0.03 * width }}>
                            {duration}
                        </Text>
                    </View>
                </TouchableOpacity>




            </View>

        </View>
    
    </View>
    )
})

export default AudioItemSocket