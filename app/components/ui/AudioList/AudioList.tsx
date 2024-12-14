import { FC, memo, useState } from 'react'
import { FlatList, TextInput, TouchableOpacity, View } from 'react-native'
import { Audio, InterruptionModeAndroid } from 'expo-av'
import { useTypedRoute } from 'app/hooks/useTypedRoute'
import { usePlaylists } from 'app/hooks/usePlaylists'
import { useSongs } from 'app/hooks/useSongs'
import { useLang } from 'app/hooks/useLang'
import { useAudioPlay } from 'app/hooks/useAudioPlay'
import { useActions } from 'app/hooks/useActions'

import AudioItem from './AudioItem'
import MenuMore from './MenuMore/MenuMore'
import EmptyList from './EmptyList'

import { ISong } from 'app/types/song.types'
import { bottomMargin, height, width } from 'app/utils/constants'
import { pause, play, playNext, resume } from './audio.methods'
import TextField from '../TextField/TextField'


interface IAudioList {
    songs: ISong[]
    type?: string
}


const AudioList: FC<IAudioList> = ({ songs, type="simple" }) => {
    const [searchText, setSearchText] = useState("")
    const [numRender, setNumRender] = useState(20)

    const { currentAudio, playbackObj, soundObj, isPlaying } = useAudioPlay()
    const { changeSoundObj, changeState, changeIsPlaying, setPlayback, setActivePlstAndIsShuffle } = useActions()
    const { playlists } = usePlaylists()
    const playlistTitle = useTypedRoute()?.params?.title

    const { i18n } = useLang()
    const [isShow, setIsShow] = useState<{state: boolean, songItem: ISong}>({
        state: false,
        songItem: {} as ISong
    })
    // const { songs } = useSongs()


    // let songsRender = !!data ? data.slice(0, numRender) : songs.slice(0, numRender)
    let songsRender = songs.slice(0, numRender)
    // @ts-ignore
    // const searchSongs = !!data ? data.filter((item: ISong) => item.filename.toLowerCase().includes(searchText.toLowerCase())) : songs.filter((item: ISong) => item.filename.toLowerCase().includes(searchText.toLowerCase()))
    const searchSongs = songs.filter((item: ISong) => item.filename.toLowerCase().includes(searchText.toLowerCase()))

    const onEndReached = () => {
        songsRender = songs.slice(0, numRender + 30)
        setNumRender(numRender + 30)
    }

    const onStartReached = () => {
        songsRender = songs.slice(0, 30)
        setNumRender(30)
    }



    const handleAudioPress = async (audio: ISong) => {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            // interruptionModeIOS: InterruptionModeIOS.DuckOthers,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
            playThroughEarpieceAndroid: false
        });

        if(soundObj === null) {
            return await play(audio, changeState, songs as any, setPlayback, setActivePlstAndIsShuffle, playlists, playlistTitle) 
        }

        // @ts-ignoreplaybackObj
        if(soundObj?.isLoaded && soundObj?.isPlaying && currentAudio.id == audio.id) {
            // @ts-ignore
            return await pause(playbackObj, changeSoundObj, changeIsPlaying)
        }

        // @ts-ignore
        if(soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id == audio.id){
            // @ts-ignore
            return await resume(playbackObj, changeSoundObj, changeIsPlaying)
        }

        // @ts-ignore
        if(soundObj.isLoaded && currentAudio !== audio.id) {
            return await playNext(playbackObj, audio, changeState, songs as any, setPlayback, setActivePlstAndIsShuffle, playlists, playlistTitle)
        }
    }

    return (

        <>
            <View className='justify-center items-center'>
                <TextField setText={setSearchText} text={searchText} placeholder={i18n.t("music.placeholderSearch")} />
            </View>

            {isShow.state && isShow.songItem ? (
                <MenuMore type={type as any} item={isShow.songItem} setIsShow={setIsShow} key={"simple"}/>
            ) : (
                <></>
            )}

            <FlatList 
                removeClippedSubviews
                // @ts-ignore
                data={searchText.length > 1 ? searchSongs : songsRender}
                // data={songsRender}
                // data={searchSongs}
                initialNumToRender={10}
                windowSize={1}
                keyExtractor={item => item.id.toString()}
                // @ts-ignore
                renderItem={({item}: {item: ISong}) => <AudioItem item={item} setIsShow={setIsShow} onAudioPress={() => handleAudioPress(item)} activeId={currentAudio?.id || ""} isPlaying={isPlaying} key={item.id} />}
                contentContainerStyle={{
                    justifyContent: 'center',
                    paddingBottom: !!playlistTitle ? bottomMargin : 0
                }}
                style={{ height: 0.75 * height }}
                onEndReached={onEndReached}
                onStartReached={onStartReached}
                ListEmptyComponent={<EmptyList />}
            />
        </>
    )
}

export default AudioList