import { FC, memo } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useAudioPlay } from 'app/hooks/useAudioPlay'
import { useActions } from 'app/hooks/useActions'
import { useColorScheme } from 'nativewind'
import { useRoute } from '@react-navigation/native'
import { useLang } from 'app/hooks/useLang'
import { useTypedNavigation } from 'app/hooks/useTypedNavigation'

import { Marquee } from '@animatereactnative/marquee';

import { width } from 'app/utils/constants'
import { MaterialIcons } from '@expo/vector-icons'
import { removeSitesFromTitle } from 'app/utils/removeSitesFromTitle'
// import getArtistTitle from 'get-artist-title'
import { pause, resume } from '../AudioList/audio.methods'
import { getArtistAndTitle } from 'app/utils/getArtistAndTitle'


const FloatPlayer: FC = () => {
    const { currentAudio, playbackObj, isPlaying } = useAudioPlay()
    const { colorScheme } = useColorScheme()
    const { navigate } = useTypedNavigation()
    const { i18n } = useLang()
    const { name } = useRoute()
    const { changeSoundObj, changeIsPlaying } = useActions()
    

    if(name == 'Player' || !currentAudio) return null;

    if(Object.values(currentAudio).length == 0) return null

    // @ts-ignore
    const filename = currentAudio.filename.slice(0, currentAudio.filename.lastIndexOf("."))
    // @ts-ignore
    // let [ artist, title ] = getArtistTitle(filename, {
    //     defaultArtist: i18n.t("music.unknownArtist")
    // })

    let { artist, title } = getArtistAndTitle(filename, i18n.t("music.unknownArtist"))

    // title = removeSitesFromTitle(title)
    if(artist.length > 26) artist = artist.slice(0, 26) + "..."


    
    const onStopOrPlayMusic = async () => {
        // @ts-ignore
        if(isPlaying) await pause(playbackObj, changeSoundObj, changeIsPlaying)
        // @ts-ignore
        else await resume(playbackObj, changeSoundObj, changeIsPlaying)
    }

    return (
     <TouchableOpacity 
        className='absolute flex-row w-full bottom-0 z-50 dark:bg-[#343536] bg-[#0d2b5c] justify-around items-center'
        // style={{marginBottom: 0.15*width, height: 0.165*width}}
        style={{height: 0.155*width}}
        onPress={() => navigate("Player")}
        activeOpacity={0.8}
    >
        <TouchableOpacity 
            className='bg-blue-400 rounded-full w-[15%] h-[70%] justify-center items-center'
            onPress={onStopOrPlayMusic}
            activeOpacity={0.7}
        >
            <MaterialIcons 
                name={isPlaying ? "pause" : "play-arrow"}
                size={0.07 * width}
                color={colorScheme == 'dark' ? "#edebe6" : "#121211"}
                className='ml-[1%]'
            />
        </TouchableOpacity>

        <View className='-ml-[6%] w-[55%] justify-start'>
            {title?.length >= 26 ? (
                <Marquee spacing={20} speed={0.3}>
                    <Text className='text-white overflow-hidden'>
                        {title}
                    </Text>
                </Marquee>
            ) : (
                <Text className='text-white'>
                    {title}
                </Text>
            )}

            <Text className='text-white opacity-50'>
                {artist}
            </Text>
        </View>

        <MaterialIcons 
            name='open-in-new'
            size={0.07 * width}
            color="#edebe6"
            className='ml-[1%]'
        />
     </TouchableOpacity>
    )
}
export default memo(FloatPlayer)