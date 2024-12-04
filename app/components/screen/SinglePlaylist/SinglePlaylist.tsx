import { FC, memo, useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { usePlaylists } from 'app/hooks/usePlaylists'
import { useTypedRoute } from 'app/hooks/useTypedRoute'
import { useTypedNavigation } from 'app/hooks/useTypedNavigation'
import { useActions } from 'app/hooks/useActions'
import { useAudioPlay } from 'app/hooks/useAudioPlay'
import { useLang } from 'app/hooks/useLang'

import AudioList from 'app/components/ui/AudioList/AudioList'
import Layout from 'app/components/ui/Layout'
import Line from 'app/components/ui/Line/Line'
import ChangeTitleForm from './ChangeTitleForm'
import PlaylistButton from './PlaylistButton'

import { width } from 'app/utils/constants'
import formatDuration from 'format-duration'
import { shuffleArray } from 'app/utils/shuffle'
import { playNext } from 'app/components/ui/AudioList/audio.methods'
import { setAsyncStorage } from 'app/utils/storage'


const SinglePlaylist: FC = memo(() => {
    //------ START ECTION: CHECK FOR HAVING A PLAYLIST -----------------------------------
    const title = useTypedRoute()?.params?.title
    // if(!title) return null
    
    const { playlists } = usePlaylists()
    // if(playlists?.length == 0) return null
    
    let plst = playlists?.map((item) => {
        if(title == item.title) return item
    }).sort()
    
    
    // if(plst.length == 0) return null
    
    const playlist = plst[0]
    // if(!playlist) return null
    //------ END SECTION: CHECK FOR HAVING A PLAYLIST -----------------------------------
    
    
    // @ts-ignore
    const [isShow, setIsShow] = useState(false)
    const [isChange, setIsChange] = useState(false)
    const [value, setValue] = useState(title || "") as any
    const { i18n } = useLang()
    const { navigate } = useTypedNavigation()
    const { playbackObj } = useAudioPlay()
    const { setActivePlstAndIsShuffle, changeState, setPlayback, setPlaylists } = useActions()
    let time = formatDuration(0)

    if(!!playlist) {
        time = formatDuration(playlist?.playlistDuration * 1000)
    }

    const deletePlaylist = () => {
        if(!playlist) return
        const newPlaylists = playlists?.filter((item) => item.title != playlist?.title)

        navigate("Playlists")
        setTimeout(() => {
            setPlaylists(newPlaylists)
            setAsyncStorage("playlists", JSON.stringify(newPlaylists))
        }, 250)
    }


    const permissionDeletePlaylist = () => {
        Alert.alert(i18n.t("permissionDeletePlaylist"), "", [
            { text: i18n.t('cancel') },
            { text: "OK", onPress: deletePlaylist }
        ])
    }

    const playPlaylist = (type: "line" | "shuffle") => {
        if(!playlist) return

        let indexes = []
        for(let i = 0; i < playlist?.songs.length; i++) indexes.push(i)
        let shuffledIndexes: number[] =  shuffleArray(indexes)

        let order = []
        for(let i = 0; i < playlist?.songs.length; i++) {
            order.push(playlist?.songs[shuffledIndexes[i]])
        }
        
        setActivePlstAndIsShuffle({
            activePlaylist: playlist,
            isShuffle: type == 'shuffle',
            orderToPlay: type == 'line' ? playlist?.songs : order
        })


        if(order.length > 0) {
            if(type == 'line') {
                playNext(playbackObj, playlist?.songs[0], changeState, playlist?.songs, setPlayback)
            }
            else {
                playNext(playbackObj,  order[0], changeState, playlist?.songs, setPlayback)
            }
        }
    }

    const onChangeTitle = () => {
        if(!playlist || !title) return 

        if(value?.length == 0) {
            setIsChange(false)
        }
            
        const newPlaylists = playlists?.map((item) => {
            if(item.title == title) {
                return {
                    date: item.date,
                    title: value?.length > 0 ? value : item.title, //
                    songs: item.songs,
                    playlistDuration: item.playlistDuration,
                    image: item.image
                }
            }
            return item
        })
        
        setPlaylists(newPlaylists as any)
        setAsyncStorage("playlists", JSON.stringify(newPlaylists as any))
        navigate("Playlists")
        setIsChange(false)
    }



    return (
     <Layout>
        <View>
            {isChange ? (
                <ChangeTitleForm title={playlist?.title || ""} onChangeTitle={onChangeTitle} value={value} setValue={setValue} />
            ) : (
                <Text 
                    className='dark:text-light text-dark text-center'
                    style={{ fontSize: 0.05 * width }}
                    onLongPress={() => setIsChange(true)}
                >
                    {playlist?.title}
                </Text>
            )}
        </View>

        <View className='flex-row justify-center items-center mt-[3%]'>
            <Text 
                className='dark:text-light text-dark opacity-65 mr-[5%]'
                style={{ fontSize: 0.035 * width }}
            >
                {time}
            </Text>
            <PlaylistButton 
                name='play-arrow' 
                onPress={() => playPlaylist("line")} 
                text={i18n.t("singlePlaylistButtonsAndTitles.playLine")}
            />
            <PlaylistButton 
                name='shuffle' 
                onPress={() => playPlaylist("shuffle")} 
                text={i18n.t("singlePlaylistButtonsAndTitles.playShuffle")}
            />
        </View>

        <Text 
            className='dark:text-light text-dark text-center mt-[5%] mb-[3%] opacity-70 underline' 
            style={{ fontSize: 0.035 * width }}
            onPress={() => setIsShow(!isShow)}
        >
            {isShow ? i18n.t("singlePlaylistButtonsAndTitles.hideSettings") : i18n.t("singlePlaylistButtonsAndTitles.showSettings")}
        </Text>

        {isShow && !!playlist ? (
            <View className='justify-around items-center flex-row  animate-fade'>
                <View className='flex-row justify-around items-center'>
                    <PlaylistButton 
                        name='add' 
                        onPress={() => navigate("AddSongsToPlaylist", { title: playlist?.title })}
                        text={i18n.t("singlePlaylistButtonsAndTitles.addSongs")}
                        bg='#248a2e'
                    />

                    <PlaylistButton 
                        name='delete' 
                        onPress={permissionDeletePlaylist}
                        text={i18n.t("singlePlaylistButtonsAndTitles.deletePlaylist")}
                        bg='#821b24'
                    />
                </View>
            </View>
        ) : <></>}

        <Line />

        <AudioList songs={playlist?.songs || []} type='playlist' />
     </Layout>
    )
})

export default SinglePlaylist